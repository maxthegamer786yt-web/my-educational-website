# Implementation Plan: GitHub Pages 404 Fix & Bulletproof Production Deployment

Eliminate the `main.jsx 404` error on GitHub Pages by enabling `.nojekyll`, deploying pre-compiled production assets with relative paths, and providing automatic build workflows.

## User Review & Critical Decisions

> [!IMPORTANT]
> GitHub Pages is a static server that does not execute Vite or compile JSX files on the fly. When GitHub Pages serves raw `src/main.jsx`, it returns a 404 error or MIME type failure.
> We will configure a hybrid structure:
> 1. Add `.nojekyll` to disable GitHub Pages' default Jekyll filter.
> 2. Output the production build with relative paths (`./assets/...`) so it works out-of-the-box on `username.github.io/my-educational-website/`.
> 3. Provide both direct root compatibility and GitHub Actions automation so it works regardless of which GitHub Pages setting is selected.

---

## 1. Overview & Core Problem

- **The Problem**: GitHub Pages was trying to load uncompiled `./src/main.jsx` from the repository root, which browsers cannot execute and GitHub Pages cannot serve.
- **The Solution**: 
  - Compile the complete application into production-ready standalone bundles (`./assets/index-...js` and `./assets/index-...css`).
  - Configure `.nojekyll` so GitHub Pages serves all static assets without dropping files.
  - Ensure the Educational Portal entry point, secret passcode system, and games (GTA V, Slope 3D, Tiny Fishing) run natively on GitHub Pages with zero 404 errors.

---

## 2. Technical Architecture & System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                 GitHub Pages Deployment Flow                 │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      GitHub Repository                       │
│  - .nojekyll (prevents Jekyll from blocking assets)         │
│  - .github/workflows/deploy.yml (auto-builds & deploys dist)│
│  - dist/ (compiled production assets with base: './')       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              Browser on GitHub Pages Domain                 │
│  - https://<user>.github.io/<repo>/                         │
│  - Loads index.html -> ./assets/index-[hash].js (200 OK)    │
│  - Educational Portal Entry Point (Google Classroom view)   │
│  - Secret Passcode Unlock -> Goon Arcade (GTA V, Slope)     │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Proposed Changes

### `vite.config.ts`
- Ensure `base: './'` is configured so all resource links are relative to the repository subpath.

### `.nojekyll` & Static Assets
- Create `.nojekyll` at repository root and in `dist/` to prevent GitHub's Jekyll engine from ignoring files.
- Verify `dist/` is fresh, self-contained, and ready for direct hosting.

### `.github/workflows/deploy.yml`
- Configure automated GitHub Pages deployment action that builds on Node 20 and uploads `./dist` directly to GitHub Pages.

---

## 4. Verification Plan

- Run `npm run build` to verify clean compilation.
- Inspect `dist/index.html` to confirm all script and style paths are relative (`./assets/...`).
- Verify HTTP status codes with local server and check build integrity.
- Run `compile_applet` and `lint_applet` to confirm zero errors.
