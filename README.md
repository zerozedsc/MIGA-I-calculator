# MIGA-i Gold Price Calculator

Client-side calculator built with **Vite + React + TypeScript**.

## Local development

**Prerequisites:** Node.js + npm

1. Install dependencies:
   - `npm install`
2. Start the dev server:
   - `npm run dev`
3. Build for production:
   - `npm run build`
4. Preview the production build locally:
   - `npm run preview`

## Deploy to Netlify

This is a static SPA.

- Build command: `npm run build`
- Publish directory: `dist`
- SPA routing: a catch-all redirect to `/index.html` is included via:
  - `public/_redirects`
  - `netlify.toml`

If Netlify UI shows **Runtime: Next.js**, switch it to a static site setup (this repo is not Next.js).

## Favicon

The app uses `favicon.svg` (wired via `index.html`).

## Local-only folders

- `.AGI-BANKS/` and `.docs/` are local-only project memory/notes and are gitignored.
