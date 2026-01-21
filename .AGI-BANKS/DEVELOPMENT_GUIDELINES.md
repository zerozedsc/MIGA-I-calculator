***
Title: Development Guidelines
LastUpdated: 2026-01-21T04:19:47Z
***

## Local development

- Install deps: `npm install`
- Dev server: `npm run dev`
- Production build: `npm run build`
- Local preview of production build: `npm run preview`

## Conventions

- TypeScript strictness is controlled via `tsconfig.json`.
- Prefer keeping calculations in `utils/` and UI logic in `components/`.

## Netlify

- Publish directory: `dist`
- Build command: `npm run build`
- SPA routing: ensure a catch-all redirect to `/index.html`.

## Troubleshooting checklist

- If the page is blank, check browser console errors (React render failures, missing DOM root, runtime exceptions).
- Verify `index.html` contains the mount element used by `index.tsx`.
