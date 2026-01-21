***
Title: Environment
LastUpdated: 2026-01-21T04:19:47Z
***

## Runtime

- OS: Linux
- Node: v23.11.1
- npm: 11.6.2

## Project

- Type: static frontend (SPA)
- Frameworks: React, Vite
- Language: TypeScript
- Package manager: npm
- Output dir (build): `dist/` (expected for Vite)

## Notes

- Netlify should be configured as a static site (not Next.js runtime).
	- If the Netlify UI shows “Runtime: Next.js”, switch it to a static/Vite setup (or rely on `netlify.toml` and clear framework overrides).
