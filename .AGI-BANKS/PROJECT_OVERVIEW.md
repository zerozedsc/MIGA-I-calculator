***
Title: MIGA-I Calculator — Project Overview
LastUpdated: 2026-01-21T04:19:47Z
***

## What this is

A small client-side web app (Vite + React + TypeScript) that calculates and compares MIGA-I pricing scenarios.

## Tech stack

- Runtime: Node.js (dev/build)
- Frontend: React + TypeScript
- Bundler/dev server: Vite
- Styling: (in-repo React components; no dedicated framework detected yet)
- Deployment target: Netlify (static hosting)

## Entry points

- HTML shell: `index.html`
- App bootstrap: `index.tsx`
- Main UI: `App.tsx`

## Key modules

- `components/` — UI pieces (form, results table, etc.)
- `utils/` — calculation + translation helpers

## Build + deploy expectations

- `npm run dev` should render the app locally.
- `npm run build` should produce a static bundle in `dist/`.
- Netlify should publish `dist/` and include SPA routing support (redirect all routes to `/index.html`).
