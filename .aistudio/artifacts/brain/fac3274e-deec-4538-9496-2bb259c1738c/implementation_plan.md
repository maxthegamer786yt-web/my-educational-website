# Implementation Plan: Cross-Origin Isolation (`coi-serviceworker`) for GTA V

Install and configure `coi-serviceworker` to provide the required `Cross-Origin-Opener-Policy: same-origin` (COOP) and `Cross-Origin-Embedder-Policy: require-corp` (COEP) headers on GitHub Pages, enabling `SharedArrayBuffer` and multithreaded WebAssembly for GTA V.

## User Review & Critical Decisions

> [!IMPORTANT]
> `SharedArrayBuffer` requires a cross-origin isolated environment (`window.crossOriginIsolated === true`). Because static hosts like GitHub Pages do not allow configuring custom HTTP response headers on the web server, `coi-serviceworker` runs as a client-side Service Worker that intercepts browser fetch requests and injects the COOP/COEP headers transparently.

---

## 1. Overview & Root Cause

- **The Problem**: GTA V runs on WebAssembly and requires multithreaded shared memory (`SharedArrayBuffer`). The browser blocks this with the message: *"not cross-origin isolated: open the page over https (or localhost); the server sends COOP/COEP"*.
- **The Solution**: 
  - Install `coi-serviceworker` into the project (`/public/coi-serviceworker.js`, root `/coi-serviceworker.js`, and `dist/`).
  - Add `<script src="./coi-serviceworker.js"></script>` to `index.html`.
  - When the browser loads the page, the service worker activates and enforces `window.crossOriginIsolated = true`, allowing GTA V to boot and run inside the arcade player.

---

## 2. Technical Architecture & System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                 Browser Loads index.html                    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                <script src="./coi-serviceworker.js">        │
│  - Registers service worker at scope "./"                   │
│  - Intercepts requests & injects COOP/COEP headers:         │
│      * Cross-Origin-Opener-Policy: same-origin              │
│      * Cross-Origin-Embedder-Policy: credentialless / corp  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 window.crossOriginIsolated = true           │
│  - SharedArrayBuffer is fully enabled by browser            │
│  - GTA V WebAssembly initializes multithreading             │
│  - Game runs inside embedded iframe without restrictions    │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Proposed Changes

### 1. Create `coi-serviceworker.js`
- Create `/public/coi-serviceworker.js` and `/coi-serviceworker.js` containing the lightweight Cross-Origin Isolation Service Worker script.
- Configure it to support GitHub Pages subpaths (`./`).

### 2. Update `index.html`
- Include `<script src="./coi-serviceworker.js"></script>` at the top of `<head>` in `index.html` so the service worker registers before the application mounts.

### 3. Build & Production Sync
- Run `npm run build` so `coi-serviceworker.js` is copied into `dist/`.
- Sync root files for GitHub Pages branch deployment (`assets/` and root `coi-serviceworker.js`).

---

## 4. Verification Plan

- Check that `coi-serviceworker.js` is accessible via HTTP 200 on `./coi-serviceworker.js`.
- Verify `compile_applet` and `lint_applet` pass with zero errors.
- Confirm `window.crossOriginIsolated` condition is handled seamlessly in the player modal.
