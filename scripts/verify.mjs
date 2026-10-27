import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const lib = join(root, 'lib');

const unique = (list) => [...new Set(list)];

const errors = [];
const warnings = [];

const read = (relativePath) => readFileSync(resolve(root, relativePath), 'utf8');
const check = (condition, message) => { if (!condition) errors.push(message); };
const warn = (condition, message) => { if (!condition) warnings.push(message); };

function cssFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return cssFiles(path);
    return entry.name.endsWith('.css') ? [path] : [];
  });
}

const stripComments = (source) => source.replace(/\/\*[\s\S]*?\*\//g, '');

// email.css is a standalone, un-layered stylesheet: it is not part of the token system.
const files = cssFiles(lib)
  .filter((file) => !file.endsWith('email.css'))
  .map((file) => ({ name: relative(root, file), source: stripComments(readFileSync(file, 'utf8')) }));

// ---------------------------------------------------------------------------
// Token resolution — read the real values from the CSS, never a hardcoded copy
// ---------------------------------------------------------------------------

// Remove `@supports not (...) { ... }` blocks (legacy-browser fallbacks): they
// redeclare tokens with their light value and must not shadow the real ones.
function withoutFallbacks(source) {
  let out = source;
  for (let start = out.indexOf('@supports not'); start !== -1; start = out.indexOf('@supports not')) {
    let depth = 0;
    let end = out.indexOf('{', start);
    for (; end < out.length; end++) {
      if (out[end] === '{') depth++;
      if (out[end] === '}' && --depth === 0) break;
    }
    out = out.slice(0, start) + out.slice(end + 1);
  }
  return out;
}

const declarations = new Map(); // --token -> last declared value
for (const { source } of files) {
  for (const [, name, value] of withoutFallbacks(source).matchAll(/(--[\w-]+)\s*:\s*([^;{}]+);/g)) {
    declarations.set(name, value.trim());
  }
}

// Split "a, b" at the top-level comma (ignores commas inside var(...) / functions).
function splitArguments(text) {
  const parts = [];
  let depth = 0;
  let current = '';
  for (const char of text) {
    if (char === '(') depth++;
    if (char === ')') depth--;
    if (char === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  parts.push(current.trim());
  return parts;
}

// Resolve a value to a hex colour for one colour scheme ('light' | 'dark').
function resolveColor(value, mode = 'light', seen = new Set()) {
  const hex = value.match(/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) return value;

  const lightDark = value.match(/^light-dark\((.*)\)$/s);
  if (lightDark) {
    const [light, dark] = splitArguments(lightDark[1]);
    return resolveColor(mode === 'dark' ? dark : light, mode, seen);
  }

  const reference = value.match(/^var\(\s*(--[\w-]+)\s*(?:,\s*(.+))?\)$/s);
  if (!reference) return null;

  const [, name, fallback] = reference;
  if (seen.has(name)) return null;

  const next = declarations.get(name) ?? fallback?.trim();
  return next ? resolveColor(next, mode, new Set(seen).add(name)) : null;
}

const color = (token, mode = 'light') => {
  const value = declarations.get(token);
  const resolved = value && resolveColor(value, mode);
  check(resolved, `cannot resolve ${token} (${mode}) to a hex colour (found: ${value ?? 'nothing'})`);
  return resolved;
};

function luminance(hex) {
  const normalized = hex.replace('#', '');
  const expanded = normalized.length === 3
    ? normalized.split('').map((char) => char + char).join('')
    : normalized;
  const [r, g, b] = [0, 2, 4].map((offset) => {
    const channel = Number.parseInt(expanded.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(foreground, background) {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

const AA_TEXT = 4.5; // WCAG 1.4.3 — documented target in abstracts/_theme.css
const AA_UI = 3; //     WCAG 1.4.11 — non-text contrast

const white = color('--color-white');

// ---------------------------------------------------------------------------
// Structural contracts
// ---------------------------------------------------------------------------

const layers = read('lib/abstracts/_layers.css');
const reset = read('lib/base/_reset.css');
const motion = read('lib/abstracts/_motion.css');
const accessibility = read('lib/utilities/_accessibility.css');
const layout = read('website/src/layouts/base.liquid');

check(
  layers.includes('@layer tokens, reset, layout, blocks, utilities, theme;'),
  'layer order declaration is missing or changed',
);
check(
  layout.includes('<a class="skip-link" href="#main">Skip to content</a>'),
  'skip-link target in the docs layout is incorrect',
);
check(accessibility.includes('.skip-link'), 'skip-link utility is missing');
check(/(^|\s):target\s*\{/.test(reset), ':target rule is missing from the reset');
check(
  /--motion-duration-instant:\s*0ms;/.test(motion) && /--motion-duration-deliberate:\s*0ms;/.test(motion),
  'reduced-motion token collapse is missing or incomplete',
);

// ---------------------------------------------------------------------------
// Documentation drift — the README quick start must match the files on disk
// ---------------------------------------------------------------------------

const readme = read('README.md');
const docsIndex = read('docs/index.mdx');
// The package maps `cubito/<path>.css` to `lib/<path>.css` (see lib/package.json "exports").
const imported = (source) => [...source.matchAll(/["']cubito\/([\w/.-]+\.css)["']/g)].map((match) => `lib/${match[1]}`);
const onDisk = cssFiles(lib)
  .map((file) => relative(root, file))
  .filter((file) => !file.endsWith('email.css') && !file.endsWith('_spacing-legacy.css'));

for (const file of unique(imported(readme).concat(imported(docsIndex)))) {
  check(onDisk.includes(file) || file.endsWith('_spacing-legacy.css'), `docs import ${file}, which does not exist`);
}
for (const file of onDisk) {
  check(imported(readme).includes(file), `README quick start does not import ${file}`);
}

const declaredOrder = layers.match(/@layer ([\w, ]+);/)?.[1];
for (const [name, source] of [['README.md', readme], ['docs/index.mdx', docsIndex]]) {
  for (const [, order] of source.matchAll(/@layer ([a-z, ]+)(?:;|\n)/g)) {
    if (order.includes(',')) check(order.trim() === declaredOrder, `${name} documents layer order "${order.trim()}", but _layers.css declares "${declaredOrder}"`);
  }
}

// ---------------------------------------------------------------------------
// Contrast — values come from the CSS, checked in both colour schemes
// ---------------------------------------------------------------------------

const buttonBackground = color('--button-default-background');
const buttonForeground = color('--button-default-color');

if (buttonBackground && buttonForeground) {
  const ratio = contrastRatio(buttonForeground, buttonBackground);
  check(ratio >= AA_TEXT, `default button contrast is ${ratio.toFixed(2)}:1, below AA (${AA_TEXT}:1)`);
}

const statuses = ['--color-status-ok', '--color-status-warning', '--color-status-ko', '--color-status-info'];
const surfaces = ['--surface', '--surface-subtle', '--surface-sunken'];

for (const mode of ['light', 'dark']) {
  const pair = (foreground, background, minimum, label, report = check) => {
    const fg = color(foreground, mode);
    const bg = color(background, mode);
    if (!fg || !bg) return;
    const ratio = contrastRatio(fg, bg);
    report(ratio >= minimum, `[${mode}] ${label}: ${foreground} (${fg}) on ${background} (${bg}) is ${ratio.toFixed(2)}:1, below ${minimum}:1`);
  };

  for (const surface of surfaces) {
    for (const text of ['--text', '--text-muted', '--text-subtle']) {
      pair(text, surface, AA_TEXT, 'text contrast');
    }
    for (const status of statuses) pair(status, surface, AA_TEXT, 'status colour as text');
  }

  pair('--text-on-inverse', '--surface-inverse', AA_TEXT, 'inverse surface');
  pair('--color-on-brand', '--color-brand', AA_TEXT, 'text on brand');
  for (const status of statuses) pair('--color-on-status', status, AA_TEXT, 'text on status fill');

  pair('--border-color-strong', '--surface', AA_UI, 'UI border');
  pair('--color-brand', '--surface', AA_TEXT, 'brand colour as text');
}

const inputBorder = color('--input-default-border-color');
if (inputBorder) {
  const ratio = contrastRatio(inputBorder, white);
  warn(ratio >= AA_UI, `input border (${inputBorder}) is ${ratio.toFixed(2)}:1 on white, below ${AA_UI}:1 for UI components (WCAG 1.4.11)`);
}

// ---------------------------------------------------------------------------
// Custom property hygiene
// ---------------------------------------------------------------------------

for (const { name, source } of files) {
  for (const [, property] of source.matchAll(/(--[\w-]+)\s*:\s*var\(\s*\1\s*[,)]/g)) {
    check(false, `${name}: ${property} references itself (cyclic, invalid at computed-value time)`);
  }

  for (const [, property] of source.matchAll(/var\(\s*(--[\w-]+)\s*\)/g)) {
    check(declarations.has(property), `${name}: var(${property}) has no fallback and the token is never defined`);
  }
}

// ---------------------------------------------------------------------------

for (const message of unique(warnings)) console.warn(`warning: ${message}`);

if (errors.length > 0) {
  for (const message of unique(errors)) console.error(`error: ${message}`);
  console.error(`\nCubito verification failed (${unique(errors).length} error(s), ${unique(warnings).length} warning(s))`);
  process.exit(1);
}

console.log(`Cubito verification passed (${unique(warnings).length} warning(s))`);
