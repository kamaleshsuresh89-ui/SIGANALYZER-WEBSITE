# SIGANALYZER Official Website — Project Status

Tracking project milestones, architectural decisions, and task statuses for the official SIGANALYZER website (Smart India Hackathon).

---

## 1. Current Milestone

**Automatic GitHub Release Synchronization (Completed)**:
- **Authoritative Source of Truth**: GitHub Releases repository (`kamaleshsuresh89-ui/SIGANALYZER`).
- **Release Provider Abstraction**:
  - `ReleaseProvider` (abstract base interface)
  - `LocalReleaseProvider` (instant, pre-bundled offline snapshot)
  - `GitHubReleaseProvider` (queries `https://api.github.com/repos/kamaleshsuresh89-ui/SIGANALYZER/releases`, with 10-minute browser session caching and zero token leakage)
- **Automatic Build-Time Sync Script**: `scripts/sync-releases.js` (`npm run sync:releases`) fetches releases, maps desktop assets (Windows, macOS, Linux), infers CPU architectures, extracts SHA-256 checksums from release notes, and writes `src/data/releases.json` and `src/data/releases-snapshot.js`.
- **GitHub Actions Workflows**:
  - `.github/workflows/release-sync.yml`: Automates release syncing via `repository_dispatch: [release-published]`, manual trigger, or periodic cron.
  - `.github/workflows/deploy.yml`: Builds and deploys the static website to GitHub Pages, automatically running `sync:releases` prior to deployment.
- **Strict Desktop-Only Scope**: Windows, macOS, Linux only. Zero mobile applications.
- **Zero Frontend Code Edits for Future Releases**: When a new release tag is published on GitHub with Windows/macOS/Linux artifacts, the sync workflow automatically ingests it as the new latest stable release, while preserving all older releases in the permanent archive.

---

## 2. Completed Tasks

- [x] **Authoritative Release Source**: Connected to `kamaleshsuresh89-ui/SIGANALYZER`.
- [x] **ReleaseProvider Abstraction**:
  - `getReleases()`: Returns all releases sorted newest → oldest.
  - `getLatestStable()`: Automatically determines the newest published stable release without hardcoded versions in UI templates.
  - `getRelease(version)`: Case- and prefix-insensitive resolution (e.g. resolves `1.0.0` and `v1.0.0`).
- [x] **Automated Desktop Asset & Architecture Detection**:
  - Windows: `.exe`, `.msi`, `.zip` (architectures: `x64`, `ARM64`).
  - macOS: `.dmg`, `.zip` (architectures: `Apple Silicon`, `Intel`, `Universal`).
  - Linux: `.AppImage`, `.deb`, `.tar.gz` (architectures: `x64`, `ARM64`).
  - Excludes non-desktop and metadata files (`.apk`, `.ipa`, `.txt`, `.sha256`, `.sig`).
- [x] **SHA-256 Integrity Verification**:
  - Parses cryptographic hashes matching asset filenames from release notes or checksum files.
  - Never invents checksums. If unavailable, displays `"Checksum not available yet."`
- [x] **Download Center Routes (`src/pages/DownloadsPage.js`)**:
  - `#/downloads`: Prominent Latest Stable hero banner, real desktop download links, file sizes, SHA-256 integrity block, and archive summary.
  - `#/downloads/latest`: Dynamically resolves to the latest stable release.
  - `#/downloads/releases`: Chronological archive of all releases.
  - `#/downloads/releases/:version`: Dedicated release detail view with artifacts table, architecture breakdown, release notes, and checksums.
- [x] **GitHub Actions Automation**:
  - Created `.github/workflows/release-sync.yml` with `repository_dispatch`, `workflow_dispatch`, and cron triggers.
  - Created `.github/workflows/deploy.yml` with build-time release sync and GitHub Pages deployment.
- [x] **Resilience & Rate-Limit Protection**:
  - Build-time pre-sync bakes release snapshot directly into static assets, ensuring sub-50ms paint times and 100% offline functionality.
  - Client-side browser fetch uses a 10-minute `sessionStorage` cache, protecting unauthenticated users from hitting GitHub's 60 req/hr rate limits.
  - Zero secrets exposed to client-side code.

---

## 3. Architecture & Data Flow

```text
                     SIGANALYZER New Release
                                ↓
                 Build Windows / macOS / Linux Assets
                                ↓
                     Create GitHub Release
                (kamaleshsuresh89-ui/SIGANALYZER)
                                ↓
                      Upload Binary Artifacts
                                ↓
             GitHub Actions (release-sync.yml / deploy.yml)
                     Runs node scripts/sync-releases.js
                                ↓
                 Updates src/data/releases.json &
                 src/data/releases-snapshot.js
                                ↓
                 Website Automatically Deploys
                                ↓
                 Download Center Automatically Shows:
                 - Newest Version as "Latest Stable"
                 - Older Versions in "Permanent Archive"
                 - Real Download Buttons & Checksums
```

---

## 4. Current Availability & Status

| Platform | Expected Formats | Status | Artifact Details |
|---|---|---|---|
| **Windows** | `.exe`, `.msi`, `.zip` | **Coming Soon** | In compilation & packaging |
| **macOS** | `.dmg`, `.zip` | **Coming Soon** | Universal binary (Apple Silicon & Intel) |
| **Linux** | `.AppImage`, `.deb`, `.tar.gz` | **Coming Soon** | x86_64 & aarch64 glibc 2.31+ |

*Note: In accordance with project integrity rules, no fake download files or fabricated checksums are published. Real assets and checksums are populated automatically from GitHub Releases upon publication.*

---

## 5. Developer Workflow: Publishing the Next SIGANALYZER Release

To publish a new SIGANALYZER version (e.g. `v1.0.0`) with **zero frontend code changes**:

1. **Build Desktop Binaries**:
   Compile the application for Windows (`.exe` or `.zip`), macOS (`.dmg`), and Linux (`.AppImage` or `.deb`).
2. **Create GitHub Release**:
   Go to [kamaleshsuresh89-ui/SIGANALYZER Releases](https://github.com/kamaleshsuresh89-ui/SIGANALYZER/releases/new).
   - Set tag: `v1.0.0` (or `v1.1.0`, etc.).
   - Set title: `SIGANALYZER v1.0.0`.
   - Paste release notes. To include SHA-256 checksums, add a section in the release notes like:
     ```markdown
     ### Checksums (SHA-256)
     - siganalyzer-v1.0.0-windows-x64-setup.exe: <64-character-sha256-hash>
     - siganalyzer-v1.0.0-macos-universal.dmg: <64-character-sha256-hash>
     - siganalyzer-v1.0.0-linux-x86_64.AppImage: <64-character-sha256-hash>
     ```
3. **Upload Artifacts**:
   Attach the `.exe`, `.dmg`, and `.AppImage` files to the GitHub Release and click **Publish Release**.
4. **Trigger Website Sync**:
   - If using `repository_dispatch`, your release pipeline can dispatch an event to the website repo.
   - Or click **Run workflow** on `.github/workflows/sync-releases.yml` in the GitHub Actions tab.
   - Or the website will automatically sync on its next deployment or scheduled 6-hour cron.
5. **Website Automatically Updates**:
   The new version becomes the **Latest Stable Release**, real download buttons with file sizes and checksums appear immediately, and older versions remain permanently in the archive.
