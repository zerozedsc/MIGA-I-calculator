***
Title: Deploy Vite SPA to Netlify
Tags: netlify, vite, spa, deploy
Summary: Publish dist/, run npm run build, and add a catch-all redirect to /index.html.
***

## Context

Vite builds a static site into `dist/`. Netlify should host this as a static SPA.

## Implementation

- Build command: `npm run build`
- Publish directory: `dist`
- Add SPA routing:
  - Preferred: `public/_redirects` with `/* /index.html 200`
  - Alternative: `netlify.toml` redirects

## Common pitfalls

- Setting Netlify "Runtime" to Next.js for a Vite SPA can mis-detect the framework and produce unexpected behavior.
- Missing SPA redirect causes 404 on deep links (not usually a blank page, but breaks routing).
