# Trace Beaver Client

Minimal React + Vite UI for uploading raster logos and downloading Potrace-generated SVGs.

## Prerequisites

- Node.js 18+
- Running backend at http://localhost:3000 (or set `VITE_SERVER_URL`)

## Installation

```bash
cd client
npm install
```

## Development

```bash
npm run dev
```

Vite serves the app on http://localhost:5173.

## Progressive Web App

The client ships with a service worker and manifest (via `vite-plugin-pwa`). After running a production build the app can be installed on desktop/mobile:

```bash
npm run build
npm run preview # visit http://localhost:4173 to install
```

Assets are cached for offline viewing and auto-updated whenever a new deployment goes live.

## Deploying to GitHub Pages

The Vite config sets `base: './'`, so the build works from any GitHub Pages project path. Deploy by pushing the `dist/` folder with the bundled `gh-pages` script:

```bash
npm run build
npm run deploy
```

The script publishes `dist/` to the repository's `gh-pages` branch (make sure the repo remote is configured and GitHub Pages is set to use that branch).

## Tips

- Upload PNG/JPEG via the file picker, use the **Paste from clipboard** button, or press `Ctrl/Cmd + V` anywhere in the page to insert clipboard images directly.
