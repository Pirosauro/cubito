# @hobiri/ui

## 0.4.0

### Minor Changes

- **`_layers.css`** (new) — Explicit `@layer tokens, reset, layout, blocks, utilities` ordering declaration. Import this as the very first stylesheet. Without it, layer precedence depended silently on import order.

- **`_theme.css`** — Fixed status colours to meet WCAG AA (4.5:1) against white backgrounds: `--color-status-ok` `#16a34a`, `--color-status-warning` `#b45309`, `--color-status-ko` `#dc2626`, `--color-status-info` `#2563eb`. Previous shorthand values (`#1a4`, `#d70`, `#d22`, `#26e`) failed contrast checks for text use.

- **`_theme.css`** — Changed `--focus-ring-color` from `fuchsia` to `var(--color-brand, #2563eb)`. The focus ring now uses the application's brand colour and falls back to a neutral blue when `--color-brand` is not yet defined.

- **`_theme.css`** — Changed `--highlight-background` from `cyan` to `color-mix(in srgb, currentColor 15%, transparent)`. Selection now renders as a subtle tint of the current text colour, adapting automatically to any context.

- **`_button.css`** — Added `[data-busy="true"]` to the hover `:not()` exclusion list. Previously only guarded by `pointer-events: none`; this makes the intent explicit and safe if pointer-events are overridden.

- **`_aspect.css`** — Fixed `@layer utility` (singular) typo to `@layer utilities`. The miscased layer name was silently creating a sixth anonymous layer outside the declared order, causing aspect utilities to float above everything else in specificity.

### Patch Changes

- **`_button.css`** — Fixed spinner `animation` fallback from `600ms` to `400ms` to match the `--motion-duration-slow` token value. The previous fallback matched `--motion-duration-deliberate` instead.

- **`_base/_dialog.css`** — Removed stray untracked file that duplicated and partially conflicted with `_blocks/_dialog.css`. `_blocks/_dialog.css` is the sole style author for the dialog element.

- **`_spacing.css`** (abstract) — Marked `--su` comment as deprecated; directs new work to `--space-*` tokens.

- **`_spacing.css`** (utility) — Added deprecation notice to header; padding/margin utilities remain for backward compatibility.

## 0.3.0

### Minor Changes

- **`_tooltip.css`** — Complete rewrite. Added real positioning, z-index (`--z-tooltip`), arrow indicator, four placement variants (`data-placement="top|bottom|left|right"`), smooth opacity/visibility transition, dark-mode colours, and reduced-motion support. Tooltip is now a production-ready component.

- **`_button.css`** — Added `aria-pressed` and `aria-expanded` toggled state (brand background + white text). Added `data-variant="ghost"` (no border, subtle hover background). Disabled selector now correctly excludes hover effects. Loading spinner uses `--motion-duration-slow` token.

- **`_callout.css`** — Added `border-radius` and a tinted `background-color` per variant using `color-mix()`. Each variant now has visible fill in addition to border and text colour.

- **`_card.css`** — Added `border-radius`, `overflow: hidden` (clips image to radius), dark-mode tokens, and `data-layout="horizontal"` variant. Pseudo-content click target now correctly raises all inner interactive elements above the overlay.

- **`_details.css`** — Fixed chevron icon in dark mode: replaced hardcoded-colour `content: url(svg)` with `mask-image` + `background-color: currentColor`. Added `data-variant="bare"` (no background). Added transition on chevron rotation with reduced-motion awareness.

- **`_nav.css`** — Fixed sidebar chevron dark-mode bug: same `mask-image` fix as `_details.css`. Added `aria-current="page"` alongside `data-state="active"` for semantic correctness. Added chevron rotation transition.

- **`_form.css`** — Added `output`, `progress`, and `meter` element styles. Added `.field-hint` helper with `data-variant="error|success"`. Added `textarea { resize: vertical; min-height }`. Disabled input styles (opacity + pointer-events). Fixed label styles for inline checkbox/radio pairs.

- **`_reset.css`** — Consolidated and corrected dark-mode tokens for `code`, `kbd`, `pre`, `th`, `tr`, `details`, `dialog`, `input`, `legend`, and `fieldset:disabled`. Fixed `svg:not([class]) path` fill to use `currentColor` instead of a token alias. Removed duplicate `dialog` rule (was in both \_reset.css and \_dialog.css block).

- **`_dialog.css` (block)** — Added `border-radius`, `max-width`, `max-height`, `overflow-y: auto`, improved shadow, and dark-mode tokens.

- **`_dialog.css` (composition)** — Fixed hardcoded `z-index: 100` → `var(--z-modal, 51)`.

- **`_color.css`** — Removed duplicate rule block that appeared outside `@layer cube {}` (was leaking unscoped styles into the cascade).

- **`_skeleton.css`** — Made `height` and `width` configurable via `--skeleton-height` and `--skeleton-width` custom properties. Renamed keyframe to `skeleton-pulse` to avoid collision. Added `data-variant="circle"` for avatar placeholders. Added dark-mode token.

- **`_typography.css` (abstract)** — Made `--font-family-heading` explicit (previously implied but undeclared), defaulting to `var(--font-family)`.

- **`_theme.css`** — Aligned `--transition-duration` and `--transition-easing` with `--motion-easing-in-out` for consistency. Fixed `@property --offset` initial-value to `0px` (must be a `<length>`, not `0`).

- **`_breadcrumb.css`** — Added dark-mode colour tokens. Added `align-items: center` to `ol`. Used `aria-current="page"` instead of `data-state="active"`.

- **`_hero.css`** — Added `data-layout="split"` two-column variant.

- **`_footnote.css`** — Added dark-mode colour tokens. Added `font-size: var(--font-size-xs)` to list items.

- **`_prose.css`** — Added tighter `--flow-space` rule for elements immediately following a heading.

- **`_typography.css` (utility)** — Added `.text-pretty`, `.text-no-wrap`, `.text-underline`, `.text-no-underline`, `.text-mono`.

- **`_animation.css`** — Added `.fade-in` and `.slide-up` entry animations. Durations now reference `--motion-duration-*` tokens.

- **`_accessibility.css`** — Added `margin: -1px` to visually-hidden rule (prevents scrollbar trigger in some browsers). Added border and border-radius to skip-link focus state.

- **`_spacing.css` (utility)** — Added `.margin-auto-block`.

- **`_display.css`** (new) — New utility file. Flexbox helpers (`.flex`, `.flex-col`, `.items-center`, `.justify-between`, etc.), display utilities (`.block`, `.hidden`, `.contents`), and overflow helpers.

- **`_pictogram.css`** — Added flex layout to individual `<figure>` children.

- **`README.md`** — Complete rewrite. Corrected z-index values (were wrong: documented 100/500/900/1000 vs actual 10/20/30/50). Added all new components, all variants, all theme hooks, complete ARIA usage guide, and dark mode override instructions.

### Patch Changes

- All SVG icons previously embedded as base64 `content: url()` values have been replaced with `mask-image` + `background-color: currentColor`. This ensures correct colour rendering in dark mode and high-contrast mode without duplicating the SVG with alternate fill values.

## 0.2.1

### Patch Changes

- f3c4285: First shared release
