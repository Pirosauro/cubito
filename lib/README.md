# cubito

CSS design system built on [CUBE CSS](https://cube.fyi) and [Every Layout](https://every-layout.dev): fluid design tokens, layout compositions, accessible base styles, blocks and utilities, organised in explicit cascade layers. Plain CSS — no build step, no JavaScript.

## Install

```sh
npm install cubito
```

## Use

Declare the layer order first, then import only the files you need. Each file maps to `cubito/<folder>/<file>.css`:

```css
@import "cubito/abstracts/_layers.css";

@import "cubito/abstracts/_theme.css";
@import "cubito/abstracts/_spacing.css";
@import "cubito/abstracts/_typography.css";

@import "cubito/base/_reset.css";
@import "cubito/compositions/_cluster.css";
@import "cubito/blocks/_card.css";
@import "cubito/utilities/_wrapper.css";
```

Set your brand colours in your own `:root` — they win over the library defaults regardless of import order:

```css
:root {
  --color-brand: #2563eb;
  --color-accent: #f59e0b;
}
```

## Documentation

The full guide (every import, token, component and utility) lives in the
[repository README](https://github.com/Pirosauro/cubito#readme).

## License

MIT
