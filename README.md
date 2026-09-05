# SIGANALYZER — Official Production Website

Official production website for **SIGANALYZER** — an automated IQ & WAV desktop signal intelligence platform developed for the **Smart India Hackathon**.

> **Analyze. Decode. Understand.**

---

## 1. Product Scope & Platforms

**SIGANALYZER is a desktop application only.**

Supported desktop platforms:
- **Microsoft Windows** (x64, ARM64)
- **Apple macOS** (Apple Silicon, Intel)
- **Linux** (x86_64, aarch64)

> [!NOTE]
> There is **no Android app and no iOS app**. The website itself is fully responsive across desktop, tablet, and mobile browsers, but mobile browser accessibility must not be confused with mobile application support.

---

## 2. Overview

SIGANALYZER transforms raw radio frequency `.iq` (complex float32/int16) and `.wav` signal captures into structured, actionable intelligence through automated parameter extraction, spectral profiling, modulation classification, constellation recovery, bitstream forensics, and protocol discovery.

### Core Architectural Principles
- **100% Offline-First Positioning:** Signals are processed entirely locally on the user's desktop hardware with zero cloud upload.
- **Scientific Rigor & Explainability:** Every parameter and classification is qualified with an explicit scientific certainty rating (`DIRECT`, `MEASURED`, `ESTIMATED`, `INFERRED`, `PROBABLE`, `UNKNOWN`) and backed by verified mathematical evidence.
- **GitHub Releases as Single Source of Truth:** Release versions, notes, artifacts, file sizes, and SHA-256 checksums are consumed automatically from [kamaleshsuresh89-ui/SIGANALYZER](https://github.com/kamaleshsuresh89-ui/SIGANALYZER/releases).
- **Permanent Release Archiving:** When newer versions arrive, older versions remain accessible in the permanent archive (`#/downloads/releases`).
- **Zero Secrets Client-Side:** Read-only public GitHub API requests require no client credentials; build-time sync scripts use `GITHUB_TOKEN` safely inside GitHub Actions.

---

## 3. Technology Stack

- **Markup & Semantics:** HTML5, Semantic Elements, WAI-ARIA Accessible Roles
- **Styles & Design System:** Modern CSS3, CSS Custom Properties (Design Tokens), Flexbox, CSS Grid, Glassmorphic Panels (`backdrop-filter`)
- **Scripting & Architecture:** Native JavaScript (ES Modules, `<script type="module">`), Modular Component Architecture
- **Instrumentation & Visualization:** Native HTML5 Canvas 2D DSP Engine (60fps, Retina HiDPI scaling, IntersectionObserver auto-sleep)
- **Local Dev Server:** Built-in zero-dependency Node.js HTTP server (`scripts/dev-server.js`)
- **Hosting Compatibility:** 100% static hosting ready (GitHub Pages, Cloudflare Pages, Vercel, Netlify, Apache, Nginx, AWS S3)

---

## 4. Download Center & Release Architecture

The website incorporates a dedicated, data-driven Download Center supporting multiple routes:

- `#/downloads` — Main distribution portal with latest stable release hero, desktop OS cards, and archive summary.
- `#/downloads/latest` — Dynamic resolution of the latest stable release.
- `#/downloads/releases` — Full chronological archive of all releases (newest → oldest).
- `#/downloads/releases/:version` — Dedicated release detail view with artifacts table, architecture breakdown, release notes, and SHA-256 integrity verification.

### Release Provider Abstraction

```
                      ReleaseProvider (Interface)
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
       LocalReleaseProvider            GitHubReleaseProvider
    (Pre-bundled Offline Snapshot)     (kamaleshsuresh89-ui/SIGANALYZER)
```

1. **Build-Time Pre-Sync (`scripts/sync-releases.js`)**:
   Runs during build/CI (`npm run sync:releases`). Queries the GitHub Releases API for `kamaleshsuresh89-ui/SIGANALYZER`, parses desktop artifacts, and writes `src/data/releases.json` and `src/data/releases-snapshot.js`.
2. **Runtime Browser Sync (`GitHubReleaseProvider`)**:
   Loads the bundled snapshot instantly (zero initial latency), then asynchronously checks GitHub's public API in the background. If a newer release is published, it updates the in-memory cache (`sessionStorage`, 10-min TTL) and seamlessly updates the UI via event dispatch.

---

## 5. Local Development & Running Instructions

The website requires zero external npm packages to be installed (`node_modules` is not required).

### Prerequisites
- Node.js (v18+) or Python 3.

### Commands

```bash
# Start local development server on port 3000
npm start

# Run release sync from GitHub Releases
npm run sync:releases

# Run build (syncs releases + verifies syntax)
npm run build

# Run syntax and integrity checks
npm run check
```

Open your browser and navigate to:
```
http://127.0.0.1:3000
```

---

## 6. How to Publish a New SIGANALYZER Release

Future releases require **zero frontend code edits**:

1. **Build Desktop Binaries**:
   Compile artifacts for Windows (`.exe` or `.zip`), macOS (`.dmg`), and Linux (`.AppImage` or `.deb`).
2. **Create GitHub Release**:
   On [kamaleshsuresh89-ui/SIGANALYZER Releases](https://github.com/kamaleshsuresh89-ui/SIGANALYZER/releases/new), create a release tag (e.g. `v1.0.0`), write release notes, and include SHA-256 hashes if available:
   ```markdown
   ### Checksums (SHA-256)
   - siganalyzer-v1.0.0-windows-x64-setup.exe: <sha256-hash>
   - siganalyzer-v1.0.0-macos-universal.dmg: <sha256-hash>
   - siganalyzer-v1.0.0-linux-x86_64.AppImage: <sha256-hash>
   ```
3. **Upload Artifacts**:
   Attach the desktop installers to the GitHub Release and click **Publish Release**.
4. **Automated Sync**:
   The GitHub Actions workflow (`.github/workflows/sync-releases.yml` or `.github/workflows/deploy.yml`) will automatically fetch the new release, update `releases.json`, and deploy the website.
5. **Result**:
   The new version automatically appears as the **Latest Stable Release** on `/downloads`, with direct download buttons and checksums, while earlier versions remain preserved in the archive.

---

## 7. License & Attribution

- **Initiative:** Smart India Hackathon.
- **Core Platform:** SIGANALYZER — Desktop Signal Intelligence Software.
- **Repository:** [kamaleshsuresh89-ui/SIGANALYZER](https://github.com/kamaleshsuresh89-ui/SIGANALYZER)
