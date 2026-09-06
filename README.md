# SIGANALYZER — Official Production Website

Official production website for **SIGANALYZER** — an automated IQ & WAV desktop signal intelligence platform developed for the **Smart India Hackathon**.

> **Analyze. Decode. Understand.**

---

## 1. Product Scope & Platforms

**SIGANALYZER is a desktop application only.**

Supported desktop platforms:
- **Microsoft Windows** (x64, ARM64)
- **Apple macOS** (Apple Silicon, Intel, Universal)
- **Linux** (x86_64, aarch64)

> [!NOTE]
> There is **no Android app and no iOS app**. The website itself is fully responsive across desktop, tablet, and mobile browsers, but mobile browser accessibility must not be confused with mobile application support.

---

## 2. Overview

SIGANALYZER transforms raw radio frequency `.iq` (complex float32/int16) and `.wav` signal captures into structured, actionable intelligence through automated parameter extraction, spectral profiling, modulation classification, constellation recovery, bitstream forensics, and protocol discovery.

### Core Architectural Principles
- **100% Offline-First Positioning:** Signals are processed entirely locally on the user's desktop hardware with zero cloud upload. The browser consumes pre-bundled static snapshots and never makes unauthenticated external runtime API requests.
- **Scientific Rigor & Explainability:** Every parameter and classification is qualified with an explicit scientific certainty rating (`DIRECT`, `MEASURED`, `ESTIMATED`, `INFERRED`, `PROBABLE`, `UNKNOWN`) and backed by verified mathematical evidence.
- **GitHub Releases as Single Source of Truth:** Release versions, notes, artifacts, file sizes, and SHA-256 checksums are consumed automatically from [kamaleshsuresh89-ui/SIGANALYZER](https://github.com/kamaleshsuresh89-ui/SIGANALYZER/releases).
- **Permanent Release Archiving:** When newer versions arrive, older versions remain accessible in the permanent archive (`#/downloads/releases`).
- **Zero Secrets Client-Side:** No tokens or secrets exist in client-side code; build-time sync scripts use `GITHUB_TOKEN` safely inside GitHub Actions.

---

## 3. Technology Stack

- **Markup & Semantics:** HTML5, Semantic Elements, WAI-ARIA Accessible Roles
- **Styles & Design System:** Modern CSS3, CSS Custom Properties (Design Tokens), Flexbox, CSS Grid, Glassmorphic Panels (`backdrop-filter`)
- **Scripting & Architecture:** Native JavaScript (ES Modules, `<script type="module">`), Modular Component Architecture
- **Instrumentation & Visualization:** Native HTML5 Canvas 2D DSP Engine (60fps, Retina HiDPI scaling, IntersectionObserver auto-sleep)
- **Production Build:** Lightweight Node.js build runner (`scripts/build.js`) compiling into `dist/`
- **Hosting & Deployment:** **Vercel Edge Network** (`vercel.json`, `dist/`)

---

## 4. Automatic Release Synchronization Architecture

The website uses **Approach C: GitHub Actions Generated Release-Data JSON + Vercel Deployment**.

```text
kamaleshsuresh89-ui/SIGANALYZER (Software Repository)
  └─ Developer publishes GitHub Release (e.g. v1.0.0 with .exe, .dmg, .AppImage)
       └─ Action (.github/workflows/notify-website.yml) fires repository_dispatch
            │
            ▼
kamaleshsuresh89-ui/SIGANALYZER-WEBSITE (Website Repository)
  └─ .github/workflows/release-sync.yml runs
       ├─ Authenticated query via GITHUB_TOKEN (5,000 req/hr)
       ├─ Fetches releases & downloads SHA256SUMS.txt / *.sha256
       ├─ Filters strictly Windows / macOS / Linux artifacts
       ├─ Updates src/data/releases.json & src/data/releases-snapshot.js
       ├─ Detects diff; commits & pushes to origin/main (without [skip ci])
            │
            ▼
Vercel Production Auto-Deployment
  └─ Runs 'npm run build' -> compiles into dist/
  └─ Deploys globally across Vercel Edge CDN in ~20 seconds
            │
            ▼
Client Browser (https://siganalyzer-website.vercel.app/)
  └─ Sub-50ms static load
  └─ /downloads displays latest release as primary
  └─ /downloads/releases preserves permanent archive
```

### Artifact & Checksum Detection Rules
- **Windows**: `.exe`, `.msi` (Architectures: `x64`, `arm64`)
- **macOS**: `.dmg`, `.pkg` (Architectures: `arm64 / Apple Silicon`, `x86_64 / Intel`, `Universal`)
- **Linux**: `.AppImage`, `.deb`, `.rpm`, `.tar.gz`, `.tar.xz` (Architectures: `x86_64 / x64`, `arm64 / aarch64`)
- **Explicitly Rejected**: `android`, `apk`, `ios`, `ipa`, source archives, debug symbols (`.pdb`, `.dsym`), documentation (`.pdf`, `.md`), and test artifacts.
- **Genuine SHA-256 Checksums**: Verified against exact 64-character hex strings (`^[a-fA-F0-9]{64}$`) from `SHA256SUMS.txt`, `.sha256` files, or release notes. If unavailable, marked as `Verification Pending`. Never fabricated.

---

## 5. Software Repository Setup (kamaleshsuresh89-ui/SIGANALYZER)

To enable automatic release notifications whenever a new desktop build is published:

1. Copy the workflow template [`scripts/siganalyzer-release-notify.yml.template`](scripts/siganalyzer-release-notify.yml.template) into the software repository:
   ```text
   kamaleshsuresh89-ui/SIGANALYZER/.github/workflows/notify-website.yml
   ```
2. Create a GitHub Personal Access Token (Classic with `repo` scope, or Fine-Grained with `Contents: Read and write` on `kamaleshsuresh89-ui/SIGANALYZER-WEBSITE`).
3. In `kamaleshsuresh89-ui/SIGANALYZER`, go to **Settings > Secrets and variables > Actions > New repository secret**:
   - **Secret Name:** `WEBSITE_SYNC_TOKEN`
   - **Secret Value:** `<your-token>`

*(Note: Even without this token, the website automatically checks every 6 hours via scheduled cron and supports 1-click manual trigger in the GitHub Actions UI).*

---

## 6. Release Naming & Tagging Convention

- **Tag format:** `vMAJOR.MINOR.PATCH` (e.g. `v1.0.0`, `v0.9.1`).
- **Stable Releases:** Standard release tag, not marked as pre-release.
- **Beta Releases:** Tagged with `-beta`, `-rc`, or marked as "Pre-release" in GitHub.
- **Nightly Releases:** Tagged with `-nightly` or `-dev`.

---

## 7. Local Development & Running Instructions

### Prerequisites
- Node.js (v18+)

### Commands
```bash
# Start local development server on port 3000
npm start

# Run release sync from GitHub Releases API
npm run sync:releases

# Run production build (syncs releases + builds dist/ + checks syntax)
npm run build

# Run preview server serving compiled dist/ on port 8080
npm run preview

# Run syntax verification across all modules
npm run check
```

---

## 8. Troubleshooting Instructions

- **Vercel 404 Resolution:** Vercel serves the compiled `dist/` directory specified in `vercel.json`. Deep links without `#` (e.g. `/downloads`) are forwarded to `/#/downloads` via the client script in `404.html`.
- **Release Sync Fails Locally:** When running without a `GITHUB_TOKEN`, GitHub's unauthenticated API limit may be reached. Set `export GITHUB_TOKEN="<your-token>"` in your terminal. If offline, the script gracefully preserves the existing snapshot without exiting with an error.
- **Empty Commit Prevention:** The GitHub Action checks `git diff --quiet src/data/releases.json src/data/releases-snapshot.js` and skips commit creation if no new release metadata was found.

---

## 9. License & Attribution

- **Initiative:** Smart India Hackathon.
- **Core Platform:** SIGANALYZER — Desktop Signal Intelligence Software.
- **Repository:** [kamaleshsuresh89-ui/SIGANALYZER](https://github.com/kamaleshsuresh89-ui/SIGANALYZER)
