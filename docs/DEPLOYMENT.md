# Lexiscope — Deployment

Lexiscope is a static site with no backend and no build-time configuration
per environment. The same `dist/` output is deployable to a domain root or
a subpath.

## Build

```bash
npm run build
```

Produces a self-contained `dist/` directory:

```
dist/
  index.html
  assets/
    index-<hash>.js
    index-<hash>.css
```

## Why it works on a subpath

`vite.config.ts` sets `base: './'`, so every emitted reference in
`dist/index.html` is relative (`./assets/index-<hash>.js`,
`./assets/index-<hash>.css`) rather than root-absolute (`/assets/...`).
A relative reference resolves against the URL the page was loaded from, so
the same build works unmodified whether it's served as:

- `https://example.com/` (domain root), or
- `https://apps.charliekrug.com/lexiscope/` (subpath)

An absolute path like `/assets/...` would 404 under the subpath case
because it would resolve to `apps.charliekrug.com/assets/...` instead of
`apps.charliekrug.com/lexiscope/assets/...`.

## Verifying end-to-end (not just eyeballing the HTML)

Reading `dist/index.html` only confirms the *references* are relative —
it doesn't confirm the browser can actually fetch them once nested under a
path. Verify by serving the build from an actual subpath directory:

```bash
npm run build
mkdir -p /tmp/subpath-check/lexiscope
cp -r dist/* /tmp/subpath-check/lexiscope/
cd /tmp/subpath-check && python3 -m http.server 8973
```

Then confirm the page and its assets load under the nested path:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8973/lexiscope/
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8973/lexiscope/assets/index-<hash>.js
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8973/lexiscope/assets/index-<hash>.css
```

All three should return `200`. This was verified on 2026-07-01 with the
current build output; re-run it after any change to `vite.config.ts` or the
asset pipeline.

## Publishing

Copy the contents of `dist/` into the `lexiscope` subdirectory served at
`apps.charliekrug.com/lexiscope/`. No server-side configuration, rewrites,
or environment variables are required.
