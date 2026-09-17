import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));

function read(relativePath) {
  return readFileSync(resolve(root, relativePath), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function hexToRgb(hex) {
  const normalized = hex.replace('#', '');
  const expanded = normalized.length === 3
    ? normalized.split('').map((char) => char + char).join('')
    : normalized;

  return [0, 2, 4].map((offset) => Number.parseInt(expanded.slice(offset, offset + 2), 16) / 255);
}

function linearize(channel) {
  return channel <= 0.03928
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4;
}

function contrastRatio(foreground, background) {
  const [fr, fg, fb] = hexToRgb(foreground);
  const [br, bg, bb] = hexToRgb(background);
  const foregroundLuminance = 0.2126 * linearize(fr) + 0.7152 * linearize(fg) + 0.0722 * linearize(fb);
  const backgroundLuminance = 0.2126 * linearize(br) + 0.7152 * linearize(bg) + 0.0722 * linearize(bb);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function tokenValue(source, tokenName) {
  const matches = [...source.matchAll(new RegExp(`${tokenName}:\\s*([^;]+);`, 'gm'))];
  assert(matches.length > 0, `missing token ${tokenName}`);
  return matches[matches.length - 1][1].trim();
}

function resolveColor(value, tokenMap) {
  const hexMatch = value.match(/#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})/);
  if (hexMatch) {
    return hexMatch[0];
  }

  const variableMatch = value.match(/var\((--[a-z0-9-]+)/i);
  assert(variableMatch, `cannot resolve color value: ${value}`);
  const resolved = tokenMap.get(variableMatch[1]);
  assert(resolved, `unknown color token: ${variableMatch[1]}`);
  return resolved;
}

const theme = read('lib/abstracts/_theme.css');
const button = read('lib/base/_button.css');
const reset = read('lib/base/_reset.css');
const motion = read('lib/abstracts/_motion.css');
const layers = read('lib/abstracts/_layers.css');
const layout = read('website/src/layouts/base.liquid');

assert(layers.includes('@layer tokens, reset, layout, blocks, utilities, theme;'), 'layer order declaration is missing or changed');
assert(layout.includes('<a class="skip-link" href="#main">Skip to content</a>'), 'skip-link target in the docs layout is incorrect');
assert(reset.includes('main:target'), 'main:target highlight is missing from the reset');
assert(motion.includes('--motion-duration-instant: 0ms;'), 'reduced-motion token collapse is missing');
assert(motion.includes('--motion-duration-deliberate: 0ms;'), 'reduced-motion token collapse is incomplete');

const tokenMap = new Map([
  ['--color-white', '#fff'],
  ['--color-black', '#0a0a0a'],
  ['--color-neutral-50', '#fcfcfc'],
  ['--color-neutral-100', '#f5f5f5'],
  ['--color-neutral-200', '#e2e2e2'],
  ['--color-neutral-300', '#c9c9c9'],
  ['--color-neutral-400', '#999999'],
  ['--color-neutral-500', '#6d6d6d'],
  ['--color-neutral-600', '#4b4b4b'],
  ['--color-neutral-700', '#333333'],
  ['--color-neutral-800', '#1e1e1e'],
  ['--color-neutral-900', '#121212'],
  ['--color-neutral-950', '#0a0a0a'],
  ['--color-status-ok', '#166534'],
  ['--color-status-warning', '#92400e'],
  ['--color-status-ko', '#991b1b'],
  ['--color-status-info', '#1e40af'],
]);

const buttonBackground = resolveColor(tokenValue(button, '--button-default-background'), tokenMap);
const buttonForeground = resolveColor(tokenValue(button, '--button-default-color'), tokenMap);

assert(contrastRatio(buttonForeground, buttonBackground) >= 7, 'default button contrast is below AAA');

for (const tokenName of ['--color-status-ok', '--color-status-warning', '--color-status-ko', '--color-status-info']) {
  const background = tokenMap.get(tokenName);
  assert(background, `missing status token ${tokenName}`);
  assert(contrastRatio('#ffffff', background) >= 7, `${tokenName} does not meet AAA with white text`);
}

console.log('Cubito verification passed');