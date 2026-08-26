# Lumen Atelier

Recovered editable source project for the Lumen Atelier GitHub Pages website.

## Important branches

- `main` — current deployed build. Kept untouched during source recovery.
- `recovery/source-rebuild` — reconstructed React/Vite source based on the final deployed build.

## Source structure

- `src/App.jsx` — readable React pages, routing, interactions, form logic and language switching.
- `src/content.js` — English and Chinese site copy, services and project case-study content.
- `src/styles.css` — editable stylesheet entry point.
- `assets/index-DHBhs0fk.css` — exact CSS used by the final deployed version, preserved to keep the recovered site visually consistent.
- `vite.config.js` — GitHub Pages base path plus static-file copying.
- `package.json` — development/build dependencies and scripts.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Vite outputs to `dist/`. The build config also preserves the existing logo, favicon files and web manifest.

## Recovery note

The original pre-build React/Vite source was never committed to this repository. This source tree was reconstructed from the final deployed JavaScript bundle and the final active stylesheet. The bilingual content, routes, services, project templates, contact form behaviour, language persistence and page structure were recovered from that final build.

For safety, merge this branch into `main` only after a local or CI build/visual check.
