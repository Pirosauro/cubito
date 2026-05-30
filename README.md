# @hobiri/ui

Enterprise-grade CSS design system built on [CUBE CSS](https://cube.fyi) methodology and [Every Layout](https://every-layout.dev) primitives.

---

## Contents

- [Architecture](#architecture)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Required tokens](#required-tokens)
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
@layer tokens, reset, layout, blocks, utilities
```

| Folder          | Layer(s)           | Purpose                                              |
| --------------- | ------------------ | ---------------------------------------------------- |
| `abstracts/`    | `tokens`           | Design tokens — custom properties only, no selectors |
| `base/`         | `reset`, `blocks`  | Element defaults and resets                          |
| `compositions/` | `layout`           | Layout primitives (Every Layout patterns)            |
| `blocks/`       | `blocks`           | Reusable UI components                               |
| `utilities/`    | `utilities`        | Single-purpose helpers                               |

---

## Installation

```sh
npm install @hobiri/ui
# or
pnpm add @hobiri/ui
```

---

## Quick start

Import layers in order. `_layers.css` must be the very first import.

```css
/* 0. Layer order — must come first */
@import "@hobiri/ui/lib/abstracts/_layers.css";

/* 1. Abstracts — design tokens */
@import "@hobiri/ui/lib/abstracts/_theme.css";
@import "@hobiri/ui/lib/abstracts/_z-index.css";
@import "@hobiri/ui/lib/abstracts/_motion.css";
@import "@hobiri/ui/lib/abstracts/_spacing.css";
@import "@hobiri/ui/lib/abstracts/_typography.css";

/* 2. Base — element defaults */
@import "@hobiri/ui/lib/base/_reset.css";
@import "@hobiri/ui/lib/base/_button.css";
@import "@hobiri/ui/lib/base/_code.css";
@import "@hobiri/ui/lib/base/_details.css";
@import "@hobiri/ui/lib/base/_form.css";
@import "@hobiri/ui/lib/base/_nav.css";
@import "@hobiri/ui/lib/base/_table.css";
@import "@hobiri/ui/lib/base/_tooltip.css";

/* 3. Compositions — layout primitives */
@import "@hobiri/ui/lib/compositions/_cluster.css";
@import "@hobiri/ui/lib/compositions/_dialog.css";
@import "@hobiri/ui/lib/compositions/_frame.css";
@import "@hobiri/ui/lib/compositions/_grid.css";
@import "@hobiri/ui/lib/compositions/_reel.css";
@import "@hobiri/ui/lib/compositions/_repel.css";
@import "@hobiri/ui/lib/compositions/_sidebar.css";
@import "@hobiri/ui/lib/compositions/_switcher.css";

/* 4. Blocks — UI components */
@import "@hobiri/ui/lib/blocks/_breadcrumb.css";
@import "@hobiri/ui/lib/blocks/_callout.css";
@import "@hobiri/ui/lib/blocks/_card.css";
@import "@hobiri/ui/lib/blocks/_dialog.css";
@import "@hobiri/ui/lib/blocks/_footnote.css";
@import "@hobiri/ui/lib/blocks/_hero.css";
@import "@hobiri/ui/lib/blocks/_pictogram.css";
@import "@hobiri/ui/lib/blocks/_prose.css";

/* 5. Utilities — always last */
@import "@hobiri/ui/lib/utilities/_accessibility.css";
@import "@hobiri/ui/lib/utilities/_animation.css";
@import "@hobiri/ui/lib/utilities/_border.css";
@import "@hobiri/ui/lib/utilities/_color.css";
@import "@hobiri/ui/lib/utilities/_display.css";
@import "@hobiri/ui/lib/utilities/_flow.css";
@import "@hobiri/ui/lib/utilities/_gap.css";
@import "@hobiri/ui/lib/utilities/_print.css";
@import "@hobiri/ui/lib/utilities/_region.css";
@import "@hobiri/ui/lib/utilities/_shadow.css";
@import "@hobiri/ui/lib/utilities/_skeleton.css";
@import "@hobiri/ui/lib/utilities/_space.css";
@import "@hobiri/ui/lib/utilities/_typography.css";
@import "@hobiri/ui/lib/utilities/_wide.css";
@import "@hobiri/ui/lib/utilities/_with-icon.css";
@import "@hobiri/ui/lib/utilities/_wrapper.css";
```

> **Legacy:** `utilities/_spacing.css` (`.padding-1`, `.margin-2`, …) is deprecated in favour of `_space.css` (`.padding-s`, `.margin-m`, …). It remains importable for backward compatibility.

---

## Required tokens

Define `--color-brand` and `--color-accent` in your own `:root` block **before** importing the library. Everything else has sensible defaults.

```css
/* app/global.css */
:root {
  --color-brand: #2563eb;
  --color-accent: #f59e0b;
}

@import "@hobiri/ui/lib/abstracts/_theme.css";
/* … rest of imports */
```

---

## Configuration model

All component tokens are plain CSS custom properties. There is no separate "theme hook" layer — override tokens at any scope using the standard cascade:

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
  --card-border: solid 1px var(--color-neutral-700);
}
```

```html
<!-- ── Inline ─────────────────────────────────────────────────────────────── -->
<article
  class="card"
  style="
  --card-border:     solid 2px var(--color-brand);
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
--color-status-ok       /* #16a34a — green  */
--color-status-warning  /* #d97706 — amber  */
--color-status-ko       /* #dc2626 — red    */
--color-status-info     /* #2563eb — blue   */

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
--transition  /* 0.25s cubic-bezier(0.4, 0, 0.2, 1) */
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

One-up pairs (e.g. `--space-s-m`) span two adjacent steps. `--gutter` is a fluid one-up pair used as the default gap in compositions.

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

**Tokens:** `--gutter`, `--cluster-horizontal-alignment`, `--cluster-vertical-alignment`

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

**Tokens:** `--grid-min-item-size` (default `16rem`), `--grid-placement`, `--gutter`

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

**Tokens:** `--sidebar-target-width` (default `20rem`), `--sidebar-content-min-width` (default `50%`), `--gutter`

### `.switcher`

Horizontal ↔ stacked layout at a container width threshold.

```html
<div class="switcher">
  <div>Column A</div>
  <div>Column B</div>
  <div>Column C</div>
</div>
```

**Tokens:** `--switcher-target-container-width` (default `40rem`), `--gutter`, `--switcher-vertical-alignment`

### `.reel`

Horizontal scroll row with optional snap.

```html
<div class="reel">…</div>
<div class="reel" data-scroll="snap">…</div>
<div class="reel" data-variant="img">…</div>
```

**Tokens:** `--reel-item-width`, `--reel-space`

### `.repel`

Pushes two groups apart; stacks on narrow viewports.

```html
<div class="repel">
  <p>Showing 1–20 of 140</p>
  <nav aria-label="Pagination">…</nav>
</div>
```

**Tokens:** `--gutter`, `--repel-vertical-alignment`

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

**Tokens:** `--card-background`, `--card-border`, `--card-radius`, `--card-padding`, `--card-image-ratio`, `--card-image-width`

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
  <pre><code>npm install @hobiri/ui</code></pre>
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
<section class="padding-4">Large padded section</section>
<div class="padding-2-inline margin-1-block">…</div>
<div class="margin-auto-inline">Horizontally centred</div>
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
<a href="#main-content" class="skip-link">Skip to content</a>

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

Internal state tokens not intended for consumer override are **prefixed `--_`**: `--_button-shadow`, `--_button-transform`.

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
- Skip link: `<a href="#main" class="skip-link">Skip to content</a>` — first child of `<body>`.
- `.sr-only` / `.visually-hidden` for screen-reader-only text.
- `prefers-reduced-motion` collapses all `--motion-duration-*` tokens to `0ms`.
- `forced-colors` (Windows High Contrast) supported in `_reset.css`.
- Status colours always paired with text or icon — never colour alone (WCAG 1.4.1).
- Tooltips reference their trigger via `aria-describedby` and never contain interactive content.

---

## Dark mode

Dark mode is handled automatically via `prefers-color-scheme: dark` in each file. To force a colour scheme on a subtree, override the surface tokens directly:

```css
.force-light {
  color-scheme: light;
  --body-background: var(--color-white);
  --body-color: var(--color-black);
  --card-background: var(--color-white);
  --card-border: solid var(--border-m) var(--color-neutral-200);
}

.force-dark {
  color-scheme: dark;
  --body-background: var(--color-neutral-900);
  --body-color: var(--color-neutral-100);
  --card-background: var(--color-neutral-800);
  --card-border: solid var(--border-m) var(--color-neutral-700);
}
```

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
