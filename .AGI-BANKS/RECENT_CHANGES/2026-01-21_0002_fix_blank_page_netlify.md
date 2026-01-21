***
Title: Fix blank page (dev) + harden Netlify deploy
Date: 2026-01-21T04:29:41Z
Author: agent/auto
Tags: bugfix, netlify, vite, deploy
RelatedFiles: [index.html, netlify.toml, public/_redirects, package.json, .gitignore]
***

## Summary

- Fixed local dev “blank page” by ensuring `index.html` loads the Vite entry module (`/index.tsx`).
- Removed an `importmap` that forced React/ReactDOM to load from CDN, which can conflict with Vite’s module resolution.
- Added Netlify configuration (`netlify.toml`) and SPA fallbacks to support deep links.
- Added Node version pinning for Netlify builds.
- Stopped ignoring `.AGI-BANKS/` and `.docs/` so metadata can be tracked in git.

## Validation

- `npm run build` succeeded.
- `vite preview` served the built HTML successfully.
- `npx tsc --noEmit` succeeded.

## Notes

Netlify UI showed “Runtime: Next.js” in the provided screenshot; this repository is a Vite SPA and should be deployed as a static site (publish `dist/`). `netlify.toml` should help make the intended settings explicit.
