# cubito

Enterprise-grade CSS design system built on [CUBE CSS](https://cube.fyi) methodology and [Every Layout](https://every-layout.dev) primitives.

---

## Contents

- [Architecture](#architecture)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Brand tokens](#brand-tokens)
- [Configuration model](#configuration-model)
- [Abstracts (design tokens)](#abstracts-design-tokens)
- [Base](#base)
- [Compositions](#compositions)
- [Blocks](#blocks)
- [Utilities](#utilities)
- [Naming conventions](#naming-conventions)
- [Accessibility](#accessibility)
- [Dark mode](#dark-mode)
- [Print](#print)
- [Email](#email)

---

## Architecture

The library uses explicit CSS cascade layers, declared in `_layers.css`:

```
@layer tokens, reset, layout, blocks, utilities, theme
```

| Folder          | Layer(s)           | Purpose                                              |
| --------------- | ------------------ | ---------------------------------------------------- |
| `abstracts/`    | `tokens`           | Design tokens — custom properties only, no selectors |
| `base/`         | `reset`, `blocks`  | Element defaults and resets                          |
| `compositions/` | `layout`           | Layout primitives (Every Layout patterns)            |
| `blocks/`       | `blocks`           | Reusable UI components                               |
| `utilities/`    | `utilities`        | Single-purpose helpers                               |
|                 | `theme`            | Reserved for your own overrides (highest precedence) |

---

## Installation

```sh
npm install cubito
# or
pnpm add cubito
```

---

## Quick start

Import layers in order. `_layers.css` must be the very first import.

```css
/* 0. Layer order — must come first */
@import "cubito/abstracts/_layers.css";

/* 1. Abstracts — design tokens */
@import "cubito/abstracts/_theme.css";
@import "cubito/abstracts/_icons.css";
@import "cubito/abstracts/_z-index.css";
@import "cubito/abstracts/_motion.css";
@import "cubito/abstracts/_spacing.css";
@import "cubito/abstracts/_typography.css";

/* 2. Base — element defaults */
@import "cubito/base/_button.css";
@import "cubito/base/_code.css";
@import "cubito/base/_details.css";
@import "cubito/base/_form.css";
@import "cubito/base/_nav.css";
@import "cubito/base/_reset.css";
@import "cubito/base/_table.css";
@import "cubito/base/_tooltip.css";

/* 3. Compositions — layout primitives */
@import "cubito/compositions/_cluster.css";
@import "cubito/compositions/_cover.css";
@import "cubito/compositions/_dialog.css";
@import "cubito/compositions/_frame.css";
@import "cubito/compositions/_grid.css";
@import "cubito/compositions/_reel.css";
@import "cubito/compositions/_repel.css";
@import "cubito/compositions/_sidebar.css";
@import "cubito/compositions/_sticky-bar.css";
@import "cubito/compositions/_switcher.css";

/* 4. Blocks — UI components */
@import "cubito/blocks/_avatar.css";
@import "cubito/blocks/_badge.css";
@import "cubito/blocks/_banner.css";
@import "cubito/blocks/_breadcrumb.css";
@import "cubito/blocks/_callout.css";
@import "cubito/blocks/_card.css";
@import "cubito/blocks/_data-list.css";
@import "cubito/blocks/_dialog.css";
@import "cubito/blocks/_drawer.css";
@import "cubito/blocks/_empty-state.css";
@import "cubito/blocks/_footnote.css";
@import "cubito/blocks/_hero.css";
@import "cubito/blocks/_pagination.css";
@import "cubito/blocks/_pictogram.css";
@import "cubito/blocks/_price.css";
@import "cubito/blocks/_progress-bar.css";
@import "cubito/blocks/_prose.css";
@import "cubito/blocks/_rating.css";
@import "cubito/blocks/_stepper.css";
@import "cubito/blocks/_tabs.css";
@import "cubito/blocks/_tag.css";
@import "cubito/blocks/_toast.css";

/* 5. Utilities — always last */
@import "cubito/utilities/_accessibility.css";
@import "cubito/utilities/_animation.css";
@import "cubito/utilities/_aspect.css";
@import "cubito/utilities/_border.css";
@import "cubito/utilities/_color.css";
@import "cubito/utilities/_flow.css";
@import "cubito/utilities/_gap.css";
@import "cubito/utilities/_low-contrast.css";
@import "cubito/utilities/_print.css";
@import "cubito/utilities/_region.css";
@import "cubito/utilities/_shadow.css";
@import "cubito/utilities/_skeleton.css";
@import "cubito/utilities/_spacing.css";
@import "cubito/utilities/_sticky.css";
@import "cubito/utilities/_truncate.css";
@import "cubito/utilities/_typography.css";
@import "cubito/utilities/_wide.css";
@import "cubito/utilities/_with-icon.css";
@import "cubito/utilities/_wrapper.css";
```

> **Legacy:** `utilities/_spacing-legacy.css` (`.padding-1`, `.margin-2`, …, based on the 8px `--su` unit) is deprecated in favour of `utilities/_spacing.css` (`.padding-s`, `.margin-m`, …, based on the fluid `--space-*` scale). It is not part of the quick start above but remains importable for backward compatibility.
>
> Import only what you use: every file is independent and declares its own tokens in `@layer tokens`.

---

## Brand tokens

Define `--color-brand` and `--color-accent` in your own `:root` block. Both have defaults (`light-dark(#26e, #6af)`, and accent follows brand) declared in `@layer tokens`, so your unlayered declaration wins regardless of import order. Everything else has sensible defaults too.

```css
/* app/global.css */
:root {
  --color-brand: #2563eb;
  --color-accent: #f59e0b;
}

/* … library imports, before or after — the layer order decides */
```

---

## Configuration model

All component tokens are plain CSS custom properties. There is no separate "theme hook" layer — override tokens at any scope using the standard cascade:

Each component exposes two kinds of tokens:

| Kind | Example | Role |
| ---- | ------- | ---- |
| Default tokens | `--card-default-background` | Declared on `:root` in `@layer tokens`. Change these to retheme a component everywhere. |
| Local override vars | `--card-background` | **Unset by default.** Where the property is applied the component reads `var(--card-background, var(--card-default-background))`, so setting the local var on `:root`, any ancestor or inline wins over the default. |

Variants (`data-variant`) and states (`:hover`, `:disabled`, `[aria-pressed]`) set the local vars on the element itself, so they win over an inherited global override. For stateful components (buttons, inputs, nav links, table rows) override the state counterpart too — e.g. `--button-background` **and** `--button-background-hover` — or change the `--*-default-*` tokens, which cover every state.

```css
/* ── Global default ───────────────────────────────────────────────────────── */
:root {
  --input-border-color: var(--color-neutral-400);
  --card-radius: var(--border-radius-s);
}

/* ── Per-context ──────────────────────────────────────────────────────────── */
.checkout-form {
  --input-border-color: var(--color-brand);
  --button-background: var(--color-brand);
  --button-color: var(--color-white);
}

.dark-panel {
  --body-background: var(--color-neutral-900);
  --body-color: var(--color-neutral-100);
  --card-background: var(--color-neutral-800);
  --card-border-color: var(--color-neutral-700);
}
```

```html
<!-- ── Inline ─────────────────────────────────────────────────────────────── -->
<article
  class="card"
  style="
  --card-border-color: var(--color-brand);
  --card-border-width: 2px;
  --card-background: color-mix(in srgb, var(--color-brand) 5%, white);
"
>
  …
</article>

<input type="text" style="--input-background: var(--color-neutral-50)" />
```

---

## Abstracts (design tokens)

### `_theme.css`

```css
/* Palette — never reference directly in components */
--color-white, --color-black
--color-neutral-50 … --color-neutral-950

/* Semantic — define in your app */
--color-brand, --color-accent

/* Status */
--color-status-ok       /* #173 — green,  5.66:1 on white */
--color-status-warning  /* #a50 — amber,  5.24:1 on white */
--color-status-ko       /* #d11 — red,    5.04:1 on white */
--color-status-info     /* #26b — blue,   5.70:1 on white */

/* Border scale */
--border-s   /* 0.0625rem  ~1px */
--border-m   /* 0.125rem   ~2px */
--border-l   /* 0.25rem    ~4px */

--border-radius-s  /* 0.125rem */
--border-radius-m  /* 0.25rem  */
--border-radius-l  /* 0.5rem   */
--border-radius    /* alias → --border-radius-m */

/* Focus ring */
--focus-ring-width, --focus-ring-offset, --focus-ring-color
--focus-ring  /* shorthand */

/* Transitions */
--transition  /* 250ms ease — prefer --motion-* for fine control */
```

### `_z-index.css`

| Token                | Value | Use case                             |
| -------------------- | ----- | ------------------------------------ |
| `--z-base`           | 0     | Default document flow                |
| `--z-dropdown`       | 10    | Inline menus and comboboxes          |
| `--z-sticky`         | 20    | Sticky headers and sidebars          |
| `--z-fixed`          | 30    | Fixed navigation bars                |
| `--z-modal-backdrop` | 50    | Overlay behind modals                |
| `--z-modal`          | 51    | Modal dialogs                        |
| `--z-popover`        | 60    | Floating panels, date pickers        |
| `--z-tooltip`        | 70    | Always-on-top instructional overlays |
| `--z-notification`   | 80    | Toast / snackbar messages            |

> **Never hardcode z-index values.** Always use these tokens.

### `_motion.css`

All durations collapse to `0ms` when `prefers-reduced-motion: reduce` is active.

| Token                          | Value | Use                               |
| ------------------------------ | ----- | --------------------------------- |
| `--motion-duration-instant`    | 50ms  | State indicators                  |
| `--motion-duration-fast`       | 150ms | Hover effects, tooltip fade       |
| `--motion-duration-base`       | 250ms | Standard transitions              |
| `--motion-duration-slow`       | 400ms | Skeleton pulse, panel open        |
| `--motion-duration-deliberate` | 600ms | Full-page transitions, onboarding |

```css
--motion-easing-linear   /* linear */
--motion-easing-in       /* starts slow — exit animations */
--motion-easing-out      /* ends slow   — enter animations */
--motion-easing-in-out   /* both        — in-place changes */
--motion-easing-spring   /* overshoots  — playful feedback */
```

### `_spacing.css`

Fluid `clamp()` tokens between 320 px (min) and 1240 px (max) viewports.

| Token          | Min     | Max     |
| -------------- | ------- | ------- |
| `--space-tiny` | 0.25rem | 0.31rem |
| `--space-xxs`  | 0.5rem  | 0.63rem |
| `--space-xs`   | 0.75rem | 0.94rem |
| `--space-s`    | 1rem    | 1.25rem |
| `--space-m`    | 1.5rem  | 1.88rem |
| `--space-l`    | 2rem    | 2.5rem  |
| `--space-xl`   | 3rem    | 3.75rem |
| `--space-xxl`  | 4rem    | 5rem    |
| `--space-huge` | 6rem    | 7.5rem  |

One-up pairs (e.g. `--space-s-m`) span two adjacent steps. `--gutter` is a fluid one-up pair used by `.wrapper` for its inline padding; each composition has its own gap token (`--cluster-gutter`, `--grid-gutter`, …), which defaults to `--space-s-l`.

### `_typography.css`

| Token              | Min     | Max     | Typical use                      |
| ------------------ | ------- | ------- | -------------------------------- |
| `--font-size-xxs`  | 0.64rem | 0.70rem | Labels, captions, legal text     |
| `--font-size-xs`   | 0.80rem | 0.94rem | Helper text, timestamps          |
| `--font-size-s`    | 1.00rem | 1.25rem | Body text (alias: `--font-size`) |
| `--font-size-m`    | 1.25rem | 1.67rem | Lead paragraphs, card headings   |
| `--font-size-l`    | 1.56rem | 2.22rem | Section headings (h3)            |
| `--font-size-xl`   | 1.95rem | 2.96rem | Page headings (h2)               |
| `--font-size-xxl`  | 2.44rem | 3.95rem | Hero headings (h1)               |
| `--font-size-huge` | 3.05rem | 5.26rem | Display / editorial headings     |

```css
--font-family          /* system UI stack */
--font-family-heading  /* inherits --font-family — override for display font */
--font-family-mono     /* system monospace stack */

--line-height-s  /* 1.25 — headings    */
--line-height-m  /* 1.5  — body (base) */
--line-height-l  /* 1.75 — prose       */

--width-s     /* 35ch */
--width-l     /* 65ch */
--width-wide  /* 100% */
```

---

## Base

### `_reset.css`

Opinionated cross-browser baseline. Includes `box-sizing: border-box`, fluid `100dvh` body, heading scale, smooth focus offsets, dark mode, `forced-colors`, and `prefers-reduced-motion`.

All surface tokens are defined here and can be overridden at any scope:

```css
/* Surface tokens (all overridable) */
--body-background / --body-color
--pre-background
--code-background / --code-color
--kbd-background / --kbd-border-color
--tr-background-odd / --tr-background-even / --th-background
--input-background / --input-border-color / --input-color
--checkbox-background / --checkbox-border-color
--fieldset-border-color / --legend-background
--details-background
--dialog-background / --dialog-color / --dialog-shadow
```

### `_button.css`

```html
<!-- Default -->
<button type="button">Save changes</button>

<!-- Variants -->
<button type="button" data-variant="outline">Cancel</button>
<button type="button" data-variant="ghost">Options</button>
<button type="button" data-variant="naked">✕</button>

<!-- States -->
<button type="button" disabled>Unavailable</button>
<button type="button" aria-busy="true">Saving…</button>
<button type="button" aria-pressed="true">Bold</button>
<button type="button" aria-expanded="true">Menu</button>

<!-- Link styled as button -->
<a href="/checkout" class="button">Checkout</a>
<a href="#" class="button" aria-disabled="true">Unavailable</a>
```

**Tokens:** `--button-background`, `--button-color`, `--button-border`, `--button-radius`, `--button-padding`, `--button-font-size`, `--button-hover-raise`

### `_form.css`

```html
<form>
  <fieldset>
    <legend>Shipping address</legend>
    <label for="name">Full name</label>
    <input type="text" id="name" name="name" autocomplete="name" required />

    <label for="country">Country</label>
    <select id="country" name="country">
      <option>United Kingdom</option>
    </select>

    <p class="field-hint" data-variant="error" role="alert">
      Please enter a valid address.
    </p>
  </fieldset>
  <button type="submit">Continue</button>
</form>
```

**Tokens (from `_reset.css`):** `--input-background`, `--input-border-color`, `--input-color`, `--checkbox-background`, `--checkbox-border-color`, `--fieldset-border-color`, `--legend-background`

### `_tooltip.css`

```html
<!-- Default: above the trigger -->
<span data-has-tooltip="true">
  <button type="button" aria-describedby="tip-delete">Delete</button>
  <span role="tooltip" id="tip-delete">Permanently removes this item</span>
</span>

<!-- Placement -->
<span data-has-tooltip="true" data-placement="bottom">…</span>
<span data-has-tooltip="true" data-placement="left">…</span>
<span data-has-tooltip="true" data-placement="right">…</span>
```

**Tokens:** `--tooltip-background`, `--tooltip-color`, `--tooltip-radius`, `--tooltip-padding`, `--tooltip-max-width`

### `_details.css`

```html
<details>
  <summary>Is shipping free?</summary>
  <p>Yes, on orders over £50.</p>
</details>

<details data-variant="fancy">
  <summary>Advanced options</summary>
  <p>Content here.</p>
</details>

<details data-variant="bare">
  <summary>Show more</summary>
  <p>Content here.</p>
</details>
```

**Tokens:** `--details-background` (from `_reset.css`), `--details-chevron-size`

### `_nav.css`

```html
<!-- Main nav -->
<nav data-variant="main" aria-label="Main">
  <ul role="list">
    <li><a href="/" aria-current="page">Home</a></li>
    <li><a href="/about/">About</a></li>
  </ul>
</nav>

<!-- Sidebar / tree nav -->
<nav data-variant="sidebar" aria-label="Section">
  <ul role="list">
    <li data-children="true" data-state="active">
      <a href="/docs/">Docs</a>
      <ul>
        <li><a href="/docs/start/" aria-current="page">Getting started</a></li>
      </ul>
    </li>
  </ul>
</nav>
```

### `_table.css`

```html
<div class="table-wrapper">
  <table>
    <caption>
      Q3 revenue by region
    </caption>
    <thead>
      <tr>
        <th scope="col">Region</th>
        <th scope="col">Revenue</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>EMEA</td>
        <td>£1.2m</td>
      </tr>
    </tbody>
  </table>
</div>

<table data-variant="borderless">
  …
</table>
<table data-variant="compact">
  …
</table>
```

**Tokens (from `_reset.css`):** `--tr-background-odd`, `--tr-background-even`, `--th-background`

---

## Compositions

Layout primitives from Every Layout. No visual opinions — pair them with blocks and utilities.

### `.cluster`

Distributes items with consistent wrapping.

```html
<ul class="cluster" role="list">
  <li><a href="#">Tag one</a></li>
  <li><a href="#">Tag two</a></li>
</ul>
```

**Tokens:** `--cluster-gutter`, `--cluster-horizontal-alignment`, `--cluster-vertical-alignment`

### `.grid`

Auto-fill responsive grid. No media queries.

```html
<ul class="grid" role="list">
  …
</ul>

<div class="grid" data-layout="50%">…</div>
<!-- 2 columns -->
<div class="grid" data-layout="33%">…</div>
<!-- 3 columns -->
```

**Tokens:** `--grid-min-item-size` (default `16rem`), `--grid-placement`, `--grid-gutter`

### `.sidebar`

Fixed-width sidebar + flexible main. Stacks below threshold. No media queries.

```html
<div class="sidebar">
  <nav>Sidebar</nav>
  <main>Content</main>
</div>

<div class="sidebar" data-direction="reverse">…</div>
<div class="sidebar" data-variant="sticky">…</div>
```

**Tokens:** `--sidebar-target-width` (default `20rem`), `--sidebar-content-min-width` (default `50%`), `--sidebar-gutter`

### `.switcher`

Horizontal ↔ stacked layout at a container width threshold.

```html
<div class="switcher">
  <div>Column A</div>
  <div>Column B</div>
  <div>Column C</div>
</div>
```

**Tokens:** `--switcher-target-container-width` (default `40rem`), `--switcher-gutter`, `--switcher-vertical-alignment`

### `.reel`

Horizontal scroll row with optional snap.

```html
<div class="reel">…</div>
<div class="reel" data-scroll="snap">…</div>
<div class="reel" data-variant="img">…</div>
```

**Tokens:** `--reel-item-width`, `--reel-space`, `--reel-img-height`

### `.repel`

Pushes two groups apart; stacks on narrow viewports.

```html
<div class="repel">
  <p>Showing 1–20 of 140</p>
  <nav aria-label="Pagination">…</nav>
</div>
```

**Tokens:** `--repel-gutter`, `--repel-vertical-alignment`

### `.frame`

Aspect-ratio crop for media. Default 16:9.

```html
<div class="frame"><img src="banner.jpg" alt="…" /></div>
<div class="frame" style="--n:1;--d:1"><img src="avatar.jpg" alt="…" /></div>
```

**Tokens:** `--n` (default `16`), `--d` (default `9`)

### `.dialog` (composition)

Fixed overlay that centres a dialog. Prefer `<dialog showModal()>` where possible.

```html
<div class="dialog" role="presentation">
  <dialog open aria-labelledby="dlg-title">…</dialog>
</div>
```

---

## Blocks

### `.card`

```html
<article class="card">
  <img src="thumbnail.jpg" alt="Article thumbnail" />
  <div class="flow">
    <h3><a href="/article/">Article title</a></h3>
    <p>Short description.</p>
    <p class="text-xs color-neutral-500">
      <time datetime="2024-06-01">1 June 2024</time>
    </p>
  </div>
</article>

<article class="card" data-layout="reversed">…</article>
<article class="card" data-layout="horizontal">…</article>
```

**Tokens:** `--card-background`, `--card-border-color`, `--card-border-style`, `--card-border-width`, `--card-radius`, `--card-padding`, `--card-image-ratio`, `--card-image-width` (each state/variant also has `--card-default-*` counterparts)

### `.callout`

```html
<div class="callout wide" role="note">
  <p>Your session will expire in 5 minutes.</p>
</div>

<div class="callout wide" data-variant="success" role="status">
  <p>Changes saved.</p>
</div>

<div class="callout wide" data-variant="error" role="alert" aria-live="assertive">
  <p>Failed to save.</p>
</div>

<!-- Variants: brand, info, warning, error, success -->
```

**Tokens:** `--callout-color`, `--callout-border`, `--callout-background`, `--callout-radius`, `--callout-padding`

### `.breadcrumb`

```html
<nav aria-label="Breadcrumb" class="breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/products/">Products</a></li>
    <li><a href="/products/shoes/" aria-current="page">Shoes</a></li>
  </ol>
</nav>

<nav class="breadcrumb" style="--breadcrumb-separator: '›'">…</nav>
```

**Tokens:** `--breadcrumb-separator`, `--breadcrumb-color`, `--breadcrumb-color-current`

### `.hero`

```html
<section class="hero region flow">
  <h1 class="heading-xxl">Ship faster with confidence</h1>
  <p class="text-l">The design system that scales with your team.</p>
  <a href="/get-started/" class="button">Get started</a>
</section>

<section class="hero region" data-layout="split">
  <div class="flow">
    <h1>Heading</h1>
    <p>Description</p>
  </div>
  <img src="hero.jpg" alt="…" />
</section>
```

**Tokens:** `--hero-space`, `--hero-align`, `--hero-flow-space`, `--hero-split-gap`, `--hero-image-radius`

### `.prose`

```html
<article class="prose flow">
  <h2>Getting started</h2>
  <p>Install the package…</p>
  <pre><code>npm install cubito</code></pre>
</article>
```

**Tokens:** `--prose-measure`, `--prose-line-height`, `--prose-flow-space`

### `.dialog` (block)

```html
<dialog id="confirm" aria-labelledby="confirm-title">
  <h2 id="confirm-title">Delete item?</h2>
  <p>This action cannot be undone.</p>
  <div class="cluster">
    <button type="button" autofocus>Delete</button>
    <button type="button" data-variant="outline">Keep item</button>
  </div>
</dialog>
<script>
  document.getElementById("confirm").showModal();
</script>
```

**Tokens:** `--dialog-background`, `--dialog-color`, `--dialog-shadow`, `--dialog-border`, `--dialog-radius`, `--dialog-padding`, `--dialog-max-width`, `--dialog-max-height`

---

## Utilities

### Typography

```html
<h1 class="heading-xxl">Display heading</h1>
<p class="text-l">Lead paragraph</p>
<span class="text-bold">Bold</span>
<span class="text-mono">monospace</span>
<p class="text-truncate">Long text that truncates…</p>
<h2 class="text-balance">Balanced headline</h2>
```

### Color

```html
<div class="background-brand color-white">Branded banner</div>
<p class="color-status-ko">Error message</p>
<div class="background-neutral-100 border border-neutral-300">Box</div>
```

### Spacing

```html
<section class="padding-l">Large padded section</section>
<div class="padding-x-s margin-y-xs">…</div>
<div class="margin-x-auto">Horizontally centred</div>
```

### Flow

```html
<div class="flow">
  <h2>Heading</h2>
  <p>Paragraph</p>
  <!-- Override gap for one element -->
  <p style="--flow-space: var(--space-xl)">More space above.</p>
</div>
```

### Skeleton

```html
<p class="skeleton"></p>
<h2 class="skeleton"></h2>
<div class="skeleton" data-variant="circle"></div>
<tr class="skeleton">
  <td></td>
  <td></td>
</tr>
<div
  class="skeleton"
  style="--skeleton-height: 2rem; --skeleton-width: 40%"
></div>
```

**Tokens:** `--skeleton-background`, `--skeleton-height`, `--skeleton-width`, `--skeleton-radius`, `--skeleton-animation`

### Border

```html
<div class="border border-brand">Brand border</div>
<div class="border-l border-neutral-300 radius-l">Thick, rounded</div>
```

### Display

```html
<div class="flex items-center justify-between gap">
  <span>Left</span>
  <span>Right</span>
</div>
<div class="hidden">Removed from layout and a11y tree</div>
<span class="sr-only">Screen-reader only</span>
```

### Shadow

```html
<div class="shadow">Raised card</div>
<a href="#" class="shadow">Interactive shadow</a>
<h2 class="text-shadow">Outlined heading</h2>
```

**Tokens:** `--shadow-color` (default `currentColor`), `--shadow-offset` (default `0.35rem`)

### With icon

```html
<span class="with-icon">
  <svg aria-hidden="true">…</svg>
  Label text
</span>

<span class="with-icon" data-icon-position="right">
  Continue
  <svg aria-hidden="true">…</svg>
</span>
```

### Wrapper

```html
<div class="wrapper">…</div>
<div class="wrapper" style="--wrapper-max-width: 60rem">…</div>
```

**Tokens:** `--wrapper-max-width` (default `90rem`)

### Region

```html
<section class="region">…</section>
<section class="region" style="--region-space: var(--space-xxl)">…</section>
```

### Animation

```html
<span class="blink">●</span>
<div class="fade-in">Revealed on mount</div>
<div class="slide-up">Slides up on mount</div>
```

### Accessibility

```html
<!-- Place as first child of <body> -->
<a href="#main" class="skip-link">Skip to content</a>

<button type="button">
  <svg aria-hidden="true">…</svg>
  <span class="sr-only">Close dialog</span>
</button>
```

---

## Naming conventions

### Custom property naming

Tokens follow a `{category}-{scale}` or `{category}-{scale}-{modifier}` pattern.

| Token                    | Category        | Scale   | Modifier        |
| ------------------------ | --------------- | ------- | --------------- |
| `--color-neutral-500`    | color           | neutral | 500             |
| `--font-size-l`          | font-size       | l       | —               |
| `--space-s-m`            | space           | s       | m (one-up pair) |
| `--border-radius-m`      | border-radius   | m       | —               |
| `--motion-duration-fast` | motion-duration | fast    | —               |
| `--z-modal`              | z               | modal   | —               |

Component tokens are **prefixed with the component name**: `--button-*`, `--card-*`, `--dialog-*`, etc.

Each component declares its tokens in `@layer tokens` as `--{component}-default-*` (plus `--{component}-{variant}-*` for variants). The unprefixed `--{component}-*` variables are the optional local overrides described in [Configuration model](#configuration-model).

### Data attributes

| Attribute            | When to use                                     | Example                                            |
| -------------------- | ----------------------------------------------- | -------------------------------------------------- |
| `data-variant="*"`   | Visual presentation variant                     | `data-variant="outline"`, `data-variant="ghost"`   |
| `data-layout="*"`    | Structural / compositional change               | `data-layout="reversed"`, `data-layout="50%"`      |
| `data-direction="*"` | Directional layout change (≠ writing direction) | `data-direction="reverse"`                         |
| `data-state="*"`     | Behavioural state driven by JavaScript          | `data-state="active"`, `data-state="visible"`      |
| `data-placement="*"` | Positioning hint for floating elements          | `data-placement="bottom"`, `data-placement="left"` |
| `data-scroll="*"`    | Scroll behaviour                                | `data-scroll="snap"`                               |

**Rules:** Never use `data-direction="rtl"` for layout — use `data-direction="reverse"`. Prefer ARIA attributes over `data-state` wherever a semantic equivalent exists.

### ARIA attributes for state

| Situation             | Attribute               | Notes                              |
| --------------------- | ----------------------- | ---------------------------------- |
| Loading / in-progress | `aria-busy="true"`      | Announced by screen readers        |
| Invalid field         | `aria-invalid="true"`   | Triggers CSS invalid style         |
| Disabled (non-form)   | `aria-disabled="true"`  | Use on `<a role="button">`         |
| Current nav link      | `aria-current="page"`   | or `"step"`, `"location"` etc.     |
| Expanded disclosure   | `aria-expanded="true"`  | `<details>` manages this natively  |
| Toggled button        | `aria-pressed="true"`   | Bold, mute, like, star             |
| Selected option       | `aria-selected="true"`  | Listbox, tabs, combobox            |
| Described by tooltip  | `aria-describedby="id"` | Wire trigger to `[role="tooltip"]` |

---

## Accessibility

- `:focus-visible` is handled globally in `_reset.css`.
- Skip link: `<a href="#main" class="skip-link">Skip to content</a>` — first child of `<body>`. Targets of in-page links get a `scroll-margin-top` via `:target` so they are not flush with the viewport edge.
- `.sr-only` / `.visually-hidden` for screen-reader-only text.
- `prefers-reduced-motion` collapses all `--motion-duration-*` tokens to `0ms`.
- `forced-colors` (Windows High Contrast) supported in `_reset.css`.
- Status colours always paired with text or icon — never colour alone (WCAG 1.4.1).
- Tooltips reference their trigger via `aria-describedby` and never contain interactive content.

---

## Dark mode

The library ships a light and a dark theme in the same tokens. Components read **adaptive role tokens** defined with `light-dark(<light>, <dark>)`, so the theme is chosen by the standard `color-scheme` property — nothing is duplicated and no JavaScript is needed.

| Role tokens | Light (unchanged) | Dark |
| ----------- | ----------------- | ---- |
| `--surface`, `--surface-subtle`, `--surface-sunken`, `--surface-strong` | white, neutral-50, -100, -200 | neutral-900, -800, -700, -600 |
| `--surface-inverse`, `--text-on-inverse` | neutral-900, neutral-50 | neutral-50, neutral-900 |
| `--border-color-subtle`, `--border-color`, `--border-color-strong` | neutral-200, -300, `#888` | neutral-700, -600, -500 |
| `--text`, `--text-muted`, `--text-subtle` | black, neutral-500, -600 | neutral-50, `#aaa`, neutral-300 |
| `--color-status-ok / warning / ko / info` | `#173`, `#a50`, `#d11`, `#26b` | `#5c8`, `#f93`, `#f77`, `#6af` |
| `--color-on-status` | white | black |

All text pairs keep WCAG AA (≥ 4.5:1) in both themes; `scripts/verify.mjs` checks it.

**Choosing the theme**

```html
<!-- Follows the operating system (default: color-scheme: light dark) -->
<html>

<!-- Forced on the whole page or on any section of it -->
<html data-theme="dark">
<section data-theme="light">…</section>
```

To pin the whole site to one theme without markup, set `--color-scheme` once: `:root { --color-scheme: light; }`.

A forced section only switches the colours that are *used* inside it. `body` already sets `color` and `background` from the roles; give the section its own if it must also look different from the page behind it:

```css
[data-theme] {
  background: var(--surface);
  color: var(--text);
}
```

**Your brand colour**

`--color-brand` defaults to `light-dark(#26e, #6af)` and `--color-on-brand` (the text on a brand fill) to `light-dark(white, black)`, so brand text and brand buttons pass AA (4.5:1) in both themes. Set the two together:

```css
:root {
  --color-brand: light-dark(#2563eb, #60a5fa);
  --color-on-brand: light-dark(#fff, #0a0a0a);
}
```

> **If you set a single brand colour** (`--color-brand: #ff3366`), also set `--color-on-brand` to the colour that reads on it in *both* themes (usually `#fff`). Left at the default, the text on your brand fills turns black in the dark theme, which is unreadable on a dark brand colour.

**Role classes**

`utilities/_color.css` has classes for the roles: `.background-surface | -subtle | -sunken | -strong | -inverse`, `.color-text | -muted | -subtle | -on-inverse | -on-brand` and `.border-subtle | -default | -strong`. The palette classes (`.color-neutral-600`, `.background-white`, …) are fixed: they look the same in both themes.

**Customising**

Override the roles, not the components — every component default is built on them:

```css
:root {
  --surface: light-dark(#fff, #0b1020);
  --text-muted: light-dark(#666, #b8c0d4);
}
```

Browsers without `light-dark()` (before Chrome 123, Safari 17.5, Firefox 120) stay on the light theme.

---

## Print

Import `utilities/_print.css` for print-safe defaults.

```html
<nav class="no-print">Navigation</nav>
<!-- hidden in print -->
<aside class="print-only">URL list</aside>
<!-- shown only in print -->
```

---

## Email

`lib/email.css` is a standalone reset for HTML email clients. It is **not** inside `@layer` and must be **inlined** into email templates — do not import it alongside the main library styles.
