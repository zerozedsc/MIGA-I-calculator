***
Title: React DOM mount element consistency
Tags: react, index.html, entrypoint
Summary: Ensure the mount element in index.html matches what index.tsx selects.
***

## Symptom

A dev server loads but shows a blank page.

## Root cause

`index.tsx` queries an element id (e.g. `#root`) that does not exist in `index.html`, or runtime errors occur before React mounts.

## Fix

- Ensure `index.html` contains `<div id="root"></div>` (or whatever id your code expects).
- Ensure `index.tsx` uses the same id.
- Add a defensive error if the element is missing (helps debugging).
