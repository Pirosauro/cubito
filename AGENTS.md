# AGENTS.md

Cubito is a CSS-only design system built on [CUBE CSS](https://cube.fyi) and [Every Layout](https://every-layout.dev). No build step, no runtime JavaScript. Published to npm as `cubito` (the `lib/` folder). See [README.md](README.md) for the full reference.

## Repository layout

| Path | What it is |
| ---- | ---------- |
| `lib/` | The published package. `cubito/<folder>/<file>.css` maps to `lib/<folder>/<file>.css` |
| `lib/abstracts/` | Design tokens only (layer `tokens`), no selectors |
| `lib/base/` | Element defaults: reset, button, form, table, nav, … |
| `lib/compositions/` | Every Layout primitives (layer `layout`): cluster, grid, repel, sidebar, … |
| `lib/blocks/` | Components (layer `blocks`): card, tag, tabs, multiselect, … |
| `lib/utilities/` | Single-purpose helpers (layer `utilities`) |
| `lib/email.css` | Standalone, un-layered stylesheet for HTML email; not part of the token system |
| `website/` | Documentation site (Vite + Liquid), consumes `lib/` through the `cubito` alias |
| `docs/` | Principles in MDX (naming, spacing, typography) |
| `examples/ecommerce/` | Static example pages built with the library |
| `scripts/verify.mjs` | Consistency checks, run with `pnpm verify` |

Package manager is pnpm (`>=10 <11`). Workspace: `lib`, `website`, `examples/*`.

## Commands

```sh
pnpm verify                    # structure, README drift, contrast (light + dark), token hygiene
pnpm -C website dev      # docs site with live CSS (use this to check rendering)
pnpm -C website build    # static build into website/dist
```

Run `pnpm verify` after any change under `lib/` or the docs. It must pass with 0 errors.

The docs site is deployed to GitHub Pages by `.github/workflows/pages.yml` on pushes to `main`. Project pages live under `/<repo>/`, so the build reads `BASE_PATH` (for example `BASE_PATH=/cubito/ pnpm -C website build`); `website/vite.config.ts` prefixes the root-relative links with it. Without `BASE_PATH` the site builds for the domain root (Cloudflare Pages, custom domain). Keep links in templates root-relative (`/components/tag`), never hardcode the repo name.

The build sets an explicit `cssTarget` so lightningcss leaves `light-dark()` alone; do not remove it, or tokens passed through `var()` break in the built site.

## Cascade layers

Declared in `lib/abstracts/_layers.css` and never reordered:

```
@layer tokens, reset, layout, blocks, utilities, theme;
```

`theme` is reserved for the consumer's own overrides. Put new CSS in the layer that matches its folder.

## Writing CSS (CUBE CSS)

- **Composition first.** Layout is delegated to the Every Layout classes (`.flow`, `.cluster`, `.repel`, `.sidebar`, `.switcher`, `.grid`, `.reel`, …). A block adds look and state, not its own layout system. Don't reinvent a stack or a cluster inside a component.
- **Intrinsic layout.** Prefer flex/grid wrapping, `min()`/`clamp()`, `:has()` and logical properties over media queries and physical properties (`inline-size`, `margin-block`, `inset-inline`, …).
- **Blocks and elements:** `.block`, `.block__element`. Variants and structural changes use data attributes: `data-variant`, `data-layout`, `data-direction`, `data-placement`. State uses native or ARIA attributes (`aria-invalid`, `aria-disabled`, `aria-pressed`, `[open]`, `:checked`); `data-state` only when no semantic equivalent exists. The tables are in README "Naming conventions".
- **Native elements before JavaScript.** Build on `<details>`, `<dialog>`, `<fieldset>`, checkboxes, etc. If JS is genuinely needed, document it in the file header and keep the CSS working without it.
- **Specificity.** Everything inside a layer; keep specificity low. If a generic base rule wins (for example the checkbox-label rule in `_form.css`), raise specificity with a second class rather than `!important`.
- **No hardcoded values** where a token exists (spacing, colour, radius, motion, z-index). Use the `--z-*` scale, never raw z-index numbers.

## Tokens

Every component declares its tokens in `@layer tokens`, on `:root`, as `--{component}-default-*` (and `--{component}-{variant}-*` for variants). The unprefixed `--{component}-*` variables are optional local overrides and must stay **unset** by default. The rule that applies a value reads:

```css
background: var(--card-background, var(--card-default-background));
```

Never declare the unprefixed variable on the component's own element as a default, and never write a self-referencing custom property (`--x: var(--x)`): both break overrides. Variants and states may set the local var on the element itself.

## Colour and dark mode

Components read adaptive role tokens, never palette steps directly, for anything that changes between themes: `--surface`, `--surface-subtle`, `--surface-sunken`, `--surface-strong`, `--surface-inverse`, `--border-color-subtle|-color|-strong`, `--text`, `--text-muted`, `--text-subtle`, `--text-on-inverse`, `--color-on-brand`, `--color-on-status`. They are `light-dark(<light>, <dark>)` pairs. Text must keep WCAG AA in both themes; `verify.mjs` checks the pairs it knows about.

## Adding or changing a component

1. Create `lib/blocks/_name.css` (or `base/`, `compositions/`, `utilities/`). Start with a header comment in the same format as the existing files: description, MARKUP PATTERN, VARIANTS, CONFIGURATION, TOKENS.
2. Tokens in `@layer tokens`, rules in the right layer, following the sections above.
3. Register it everywhere it is listed:
   - the `@import` list in [README.md](README.md) (quick start) and a README section with markup and tokens
   - `website/src/styles/main.css` and the import list in `website/src/pages/getting-started.liquid`
   - `website/src/data/nav.json` and the card on `website/src/pages/index.liquid`
   - a docs page in `website/src/pages/{components,base,layouts,utilities}/name.liquid`, same structure as the sibling pages (demo, "Show code", token table)
4. Add an entry to [CHANGELOG.md](CHANGELOG.md) under `## Unreleased`.
5. Run `pnpm verify`, then look at the docs page in the dev server in both themes (`data-theme="dark"` on `<html>`).

Renaming or removing a token, class or data attribute is a breaking change: list it under "Breaking Changes" in the CHANGELOG.

## Documentation

- Docs pages in `website/` are hand-written Liquid; the code shown must match the demo above it.
- Keep the README import list identical to the files on disk (`verify.mjs` checks this).
- Docs and code comments are in English.

## Releasing

Done by the maintainer: version in `lib/package.json` and `website/src/data/nav.json`, CHANGELOG heading, tag `vX.Y.Z`, `npm publish` from `lib/` (needs an OTP). Don't commit, tag, push or publish unless asked.
