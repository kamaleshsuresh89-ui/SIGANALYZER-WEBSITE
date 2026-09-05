/**
 * SIGANALYZER DownloadsPage (Download Center & Version Management)
 * 
 * Professional scientific/engineering software distribution portal.
 * STRICT PRODUCT SCOPE:
 * - Desktop application ONLY (Windows, macOS, Linux).
 * - There is NO Android app and NO iOS app.
 * - Single source of truth: GitHub Releases (kamaleshsuresh89-ui/SIGANALYZER).
 * - Real-time + build-time synchronization.
 * - Support for:
 *   - /downloads (Main portal with latest stable release & quick platform cards)
 *   - /downloads/latest (Dynamic resolution of the latest stable release)
 *   - /downloads/releases (Archive of all versions, sorted newest to oldest)
 *   - /downloads/releases/[version] (Dedicated release detail page with SHA-256 integrity, notes, artifacts)
 */

import {
  getLatestStableRelease,
  getAllReleases,
  getReleaseByVersion,
  detectUserDesktopPlatform,
  PLATFORMS,
  RELEASE_STATUS,
  RELEASE_CHANNELS,
  REPOSITORY
} from '../data/releases.js';

export function renderDownloadsPage(subPath = '') {
  const latestStable = getLatestStableRelease();
  const allReleases = getAllReleases();
  const detectedPlat = detectUserDesktopPlatform();

  // Normalize subPath
  const cleanSubPath = (subPath || '').replace(/^\/downloads\/?/, '').trim();

  // Check if viewing specific version: /downloads/releases/[version]
  const releaseMatch = cleanSubPath.match(/^releases\/(.+)$/);
  if (releaseMatch && releaseMatch[1]) {
    const targetVersion = releaseMatch[1].trim();
    const release = getReleaseByVersion(targetVersion);
    if (release) {
      return renderVersionDetailPage(release, allReleases);
    }
    return renderVersionNotFoundPage(targetVersion);
  }

  // Check if viewing all releases archive: /downloads/releases
  if (cleanSubPath === 'releases') {
    return renderAllReleasesArchivePage(allReleases, latestStable);
  }

  // If viewing /downloads/latest, render detailed view of the latest stable release
  if (cleanSubPath === 'latest') {
    return renderVersionDetailPage(latestStable, allReleases, true);
  }

  // Default: Main Download Center portal
  return renderMainDownloadCenter(latestStable, allReleases, detectedPlat);
}

/**
 * 1. MAIN DOWNLOAD CENTER PORTAL (/downloads)
 */
function renderMainDownloadCenter(latest, allReleases, detectedPlat) {
  const isComingSoon = latest.status === RELEASE_STATUS.COMING_SOON;

  // Platform Cards (Windows, macOS, Linux)
  const platformCardsHtml = Object.values(PLATFORMS).map(plat => {
    const isDetected = detectedPlat && plat.id === detectedPlat.id;
    const artifacts = latest.artifacts.filter(a => a.platform === plat.id);
    const availableArtifact = artifacts.find(a => a.available && a.downloadUrl);

    return `
      <div class="card p-6" style="background: rgba(14, 20, 32, 0.75); border: 1px solid ${isDetected ? 'var(--border-accent-cyan)' : 'var(--border-default)'}; position: relative; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          ${isDetected ? `
            <div class="badge badge-cyan mb-3" style="font-size: 0.68rem;">
              MATCHES YOUR SYSTEM (${plat.name})
            </div>
          ` : `
            <div class="font-mono text-muted mb-3" style="font-size: 0.72rem; text-transform: uppercase;">
              DESKTOP PLATFORM
            </div>
          `}

          <h3 style="font-size: 1.4rem; font-weight: 700; margin-bottom: 0.25rem;">${plat.name}</h3>
          <div style="font-size: 0.825rem; color: var(--text-muted); margin-bottom: 1rem;">
            ${plat.tagline}
          </div>

          <div class="font-mono" style="font-size: 0.78rem; color: var(--text-secondary); line-height: 1.65; margin-bottom: 1.25rem;">
            <div><strong>Supported Arch:</strong> ${plat.supportedArchs.join(', ')}</div>
            <div><strong>Distribution Formats:</strong> ${plat.expectedFormats.join(', ')}</div>
            <div><strong>Minimum OS:</strong> ${plat.minOs}</div>
            ${availableArtifact ? `<div style="color: var(--accent-cyan); margin-top: 0.4rem;"><strong>File Size:</strong> ${availableArtifact.fileSize}</div>` : ''}
          </div>
        </div>

        <div class="pt-4" style="border-top: 1px solid var(--border-subtle);">
          ${availableArtifact ? `
            <a href="${availableArtifact.downloadUrl}" class="btn btn-primary" style="width: 100%;" target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span>Download for ${plat.name}</span>
            </a>
            <div class="text-center font-mono mt-2" style="font-size: 0.72rem; color: var(--text-muted); word-break: break-all;">
              ${availableArtifact.fileName}
            </div>
          ` : `
            <button class="btn btn-secondary" style="width: 100%; opacity: 0.85; cursor: not-allowed;" disabled>
              <span>Coming Soon</span>
            </button>
            <div class="text-center font-mono mt-2" style="font-size: 0.72rem; color: var(--text-muted);">
              Download will be available when the release is published.
            </div>
          `}
        </div>
      </div>
    `;
  }).join('');

  // Historical release summary cards
  const archiveListHtml = allReleases.map(rel => `
    <div class="card p-5 mb-3" style="border-color: var(--border-subtle);">
      <div class="flex items-center justify-between flex-wrap gap-2 mb-2">
        <div class="flex items-center gap-3">
          <span class="font-mono text-cyan" style="font-size: 1.15rem; font-weight: 700;">v${rel.version}</span>
          <span class="badge ${rel.channel === RELEASE_CHANNELS.STABLE ? 'badge-cyan' : 'badge-amber'}">${rel.channel.toUpperCase()}</span>
          <span class="badge ${rel.status === RELEASE_STATUS.AVAILABLE ? 'badge-emerald' : 'badge-outline'}">
            ${rel.status === RELEASE_STATUS.AVAILABLE ? 'AVAILABLE' : 'COMING SOON'}
          </span>
          <span class="font-mono text-muted" style="font-size: 0.8rem;">${rel.releaseDate}</span>
        </div>
        <div class="flex items-center gap-2">
          ${rel.htmlUrl ? `
            <a href="${rel.htmlUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost btn-sm font-mono" style="font-size: 0.75rem;">
              GitHub ↗
            </a>
          ` : ''}
          <a href="#/downloads/releases/v${rel.version}" class="btn btn-secondary btn-sm">
            View Release Details →
          </a>
        </div>
      </div>
      <p style="font-size: 0.875rem; color: var(--text-secondary);">${rel.description}</p>
      <div class="mt-2 font-mono text-muted" style="font-size: 0.75rem;">
        Platforms: ${rel.supportedPlatforms.map(p => p.toUpperCase()).join(' • ')}
      </div>
    </div>
  `).join('');

  return `
    <main class="container" style="padding-top: calc(var(--nav-height) + 2.5rem); padding-bottom: 5rem;">
      
      <!-- Portal Header -->
      <div class="text-center mb-10">
        <div class="badge badge-cyan mb-3">DESKTOP SOFTWARE DISTRIBUTION</div>
        <h1 class="hero-title mb-3" style="font-size: clamp(2.2rem, 5vw, 3.5rem);">
          SIGANALYZER Download Center
        </h1>
        <p class="section-desc mx-auto" style="margin-left: auto; margin-right: auto;">
          Official distribution hub for <strong>Windows, macOS, and Linux</strong>. Backed automatically by GitHub Releases with 100% offline-first execution and permanent version archiving.
        </p>
        
        <div class="mt-3 inline-flex items-center gap-2 font-mono" style="font-size: 0.75rem; color: var(--text-muted);">
          <span>Authoritative Source:</span>
          <a href="https://github.com/${REPOSITORY}/releases" target="_blank" rel="noopener noreferrer" class="text-cyan" style="text-decoration: underline;">
            github.com/${REPOSITORY}/releases ↗
          </a>
        </div>
      </div>

      <!-- LATEST STABLE RELEASE HERO CARD -->
      <div class="card card-glass p-8 mb-12" style="border: 1px solid var(--border-accent-cyan); box-shadow: var(--shadow-glow-cyan);">
        
        <div class="flex items-center justify-between flex-wrap gap-4 mb-6" style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem;">
          <div>
            <div class="font-mono text-cyan mb-1" style="font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">
              ★ LATEST STABLE RELEASE
            </div>
            <h2 style="font-size: 1.85rem; font-weight: 800; display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
              <span>SIGANALYZER v${latest.version}</span>
              <span class="badge badge-cyan">STABLE RELEASE</span>
              <span class="badge ${isComingSoon ? 'badge-outline' : 'badge-emerald'}">
                ${isComingSoon ? 'COMING SOON' : 'AVAILABLE'}
              </span>
            </h2>
          </div>

          <div class="flex items-center gap-3">
            ${latest.htmlUrl ? `
              <a href="${latest.htmlUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost btn-sm font-mono">
                View on GitHub ↗
              </a>
            ` : ''}
            <a href="#/downloads/releases/v${latest.version}" class="btn btn-secondary btn-sm">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              <span>Release Notes</span>
            </a>
            <a href="#/downloads/latest" class="btn btn-outline-cyan btn-sm">
              <span>Full Release Telemetry</span>
            </a>
          </div>
        </div>

        <p style="font-size: 1.05rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem; max-width: 860px;">
          ${latest.description}
        </p>

        <!-- Supported Desktop Platforms Row -->
        <div class="font-mono text-muted mb-4" style="font-size: 0.8rem;">
          SUPPORTED DESKTOP PLATFORMS:
          <span class="text-cyan font-bold" style="margin-left: 0.5rem;">Windows</span> • 
          <span class="text-cyan font-bold">macOS</span> • 
          <span class="text-cyan font-bold">Linux</span>
        </div>

        <!-- 3 Desktop Platform Cards -->
        <div class="grid grid-cols-1 md-grid-cols-3 gap-5 mb-6">
          ${platformCardsHtml}
        </div>

        <!-- Checksum & Security Section -->
        <div class="p-4 rounded-md" style="background: rgba(0, 0, 0, 0.4); border: 1px solid var(--border-subtle); font-family: var(--font-mono); font-size: 0.78rem;">
          <div class="flex items-center justify-between mb-1 flex-wrap gap-2">
            <span class="text-emerald font-bold">SHA-256 INTEGRITY VERIFICATION:</span>
            <span class="text-muted">Algorithm: SHA-256</span>
          </div>
          <div style="color: var(--text-secondary);">
            Official cryptographic hashes are published alongside binaries in GitHub Releases to ensure tamper-evident downloads. Checksums for upcoming builds will be published upon package release.
          </div>
        </div>

      </div>

      <!-- ALL RELEASES / VERSION ARCHIVE SECTION -->
      <div class="mt-12 pt-8" style="border-top: 1px solid var(--border-subtle);" id="archive-section">
        <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 class="section-title" style="font-size: 1.6rem;">All Releases & Permanent Archive</h2>
            <p style="color: var(--text-secondary); font-size: 0.925rem;">
              Previous versions remain permanently accessible to ensure scientific reproducibility and auditing.
            </p>
          </div>
          <div class="flex items-center gap-3">
            <span class="badge badge-outline">${allReleases.length} ARCHIVED RELEASES</span>
            <a href="#/downloads/releases" class="btn btn-secondary btn-sm">View Full Archive Portal</a>
          </div>
        </div>

        <div>
          ${archiveListHtml}
        </div>
      </div>

    </main>
  `;
}

/**
 * 2. ALL RELEASES ARCHIVE PAGE (/downloads/releases)
 */
function renderAllReleasesArchivePage(allReleases, latestStable) {
  const releasesCardsHtml = allReleases.map(rel => {
    const isLatest = rel.version === latestStable.version;

    return `
      <div class="card card-interactive p-6 mb-6" style="border: 1px solid ${isLatest ? 'var(--border-accent-cyan)' : 'var(--border-default)'};">
        <div class="flex items-center justify-between flex-wrap gap-3 mb-3">
          <div class="flex items-center gap-3">
            <span class="font-mono text-cyan" style="font-size: 1.35rem; font-weight: 800;">v${rel.version}</span>
            <span class="badge ${rel.channel === RELEASE_CHANNELS.STABLE ? 'badge-cyan' : 'badge-amber'}">${rel.channel.toUpperCase()}</span>
            ${isLatest ? '<span class="badge badge-emerald">LATEST STABLE</span>' : ''}
            <span class="badge ${rel.status === RELEASE_STATUS.AVAILABLE ? 'badge-emerald' : 'badge-outline'}">
              ${rel.status === RELEASE_STATUS.AVAILABLE ? 'AVAILABLE' : 'COMING SOON'}
            </span>
          </div>
          <div class="font-mono text-muted" style="font-size: 0.85rem;">
            Released: ${rel.releaseDate}
          </div>
        </div>

        <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.5rem;">${rel.title || `SIGANALYZER v${rel.version}`}</h3>
        <p style="font-size: 0.925rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.25rem;">${rel.description}</p>

        <!-- Artifacts overview -->
        <div class="p-3 rounded mb-4" style="background: rgba(0, 0, 0, 0.35); border: 1px solid rgba(255, 255, 255, 0.05); font-family: var(--font-mono); font-size: 0.76rem;">
          <div class="text-muted mb-1">SUPPORTED DESKTOP PACKAGES:</div>
          <div class="flex flex-wrap gap-3" style="color: var(--text-primary);">
            ${rel.artifacts.map(a => `
              <span>• ${a.platform.toUpperCase()} (${a.architecture} ${a.format})</span>
            `).join('')}
          </div>
        </div>

        <div class="flex items-center justify-between pt-3" style="border-top: 1px solid var(--border-subtle);">
          <div class="font-mono text-muted" style="font-size: 0.78rem;">
            Desktop Application Only (Windows, macOS, Linux)
          </div>
          <div class="flex items-center gap-2">
            ${rel.htmlUrl ? `
              <a href="${rel.htmlUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost btn-sm font-mono">
                GitHub ↗
              </a>
            ` : ''}
            <a href="#/downloads/releases/v${rel.version}" class="btn btn-primary btn-sm">
              Inspect v${rel.version} Details & Artifacts →
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <main class="container" style="padding-top: calc(var(--nav-height) + 2.5rem); padding-bottom: 5rem;">
      <div class="mb-8">
        <a href="#/downloads" class="btn btn-ghost btn-sm mb-4" style="color: var(--accent-cyan);">
          ← Back to Download Center
        </a>
        <div class="badge badge-cyan mb-2">VERSION ARCHIVE</div>
        <h1 class="hero-title mb-3" style="font-size: clamp(2rem, 4vw, 3rem);">
          SIGANALYZER Release Archive
        </h1>
        <p class="section-desc">
          Permanent chronological archive of all SIGANALYZER desktop builds. Source of truth: <a href="https://github.com/${REPOSITORY}/releases" target="_blank" rel="noopener noreferrer" class="text-cyan">GitHub Releases</a>.
        </p>
      </div>

      <div>
        ${releasesCardsHtml}
      </div>
    </main>
  `;
}

/**
 * 3. DEDICATED VERSION DETAIL PAGE (/downloads/releases/[version])
 */
function renderVersionDetailPage(release, allReleases, isLatestRoute = false) {
  const isComingSoon = release.status === RELEASE_STATUS.COMING_SOON;

  // What's new bullet points
  const whatsNewHtml = (release.whatsNew || []).map(item => `
    <li class="flex items-start gap-2">
      <span style="color: var(--accent-cyan); font-weight: bold;">✓</span>
      <span>${item}</span>
    </li>
  `).join('');

  // Artifacts table / cards
  const artifactsHtml = release.artifacts.map(art => `
    <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
      <td style="padding: 1rem 0.75rem; font-weight: 700; color: #f8fafc;">
        ${art.platform.toUpperCase()}
      </td>
      <td style="padding: 1rem 0.75rem; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary);">
        ${art.architecture || 'Universal'}
      </td>
      <td style="padding: 1rem 0.75rem; font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-cyan);">
        ${art.format}
      </td>
      <td style="padding: 1rem 0.75rem; font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-secondary);">
        ${art.fileName || 'Not published yet'}
      </td>
      <td style="padding: 1rem 0.75rem; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">
        ${art.fileSize || 'TBD'}
      </td>
      <td style="padding: 1rem 0.75rem;">
        ${art.available && art.downloadUrl ? `
          <a href="${art.downloadUrl}" class="btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer">Download</a>
        ` : `
          <button class="btn btn-secondary btn-sm" style="opacity: 0.8; cursor: not-allowed;" disabled>Coming Soon</button>
        `}
      </td>
    </tr>
  `).join('');

  // Check if any artifact has an extracted checksum
  const artifactsWithChecksums = release.artifacts.filter(a => a.checksum);

  // Known issues bullet points
  const knownIssuesHtml = (release.knownIssues || []).map(issue => `
    <li class="flex items-start gap-2">
      <span style="color: var(--accent-amber); font-weight: bold;">!</span>
      <span>${issue}</span>
    </li>
  `).join('');

  return `
    <main class="container" style="padding-top: calc(var(--nav-height) + 2.5rem); padding-bottom: 5rem;">
      
      <!-- Back Link -->
      <div class="mb-6 flex items-center justify-between flex-wrap gap-3">
        <a href="#/downloads/releases" class="btn btn-ghost btn-sm" style="color: var(--accent-cyan);">
          ← Back to All Releases Archive
        </a>
        <div class="font-mono text-muted flex items-center gap-3" style="font-size: 0.8rem;">
          ${release.htmlUrl ? `
            <a href="${release.htmlUrl}" target="_blank" rel="noopener noreferrer" class="text-cyan font-mono">
              View on GitHub ↗
            </a>
            <span>•</span>
          ` : ''}
          <span>PERMANENT RELEASE RECORD</span>
        </div>
      </div>

      <!-- Release Header Card -->
      <div class="card card-glass p-8 mb-8" style="border: 1px solid var(--border-default);">
        <div class="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="font-mono text-cyan" style="font-size: 2rem; font-weight: 800;">v${release.version}</span>
              <span class="badge ${release.channel === RELEASE_CHANNELS.STABLE ? 'badge-cyan' : 'badge-amber'}">${release.channel.toUpperCase()}</span>
              <span class="badge ${isComingSoon ? 'badge-outline' : 'badge-emerald'}">
                ${isComingSoon ? 'COMING SOON' : 'AVAILABLE'}
              </span>
              ${isLatestRoute ? '<span class="badge badge-emerald">LATEST STABLE</span>' : ''}
            </div>
            <h1 style="font-size: 1.4rem; font-weight: 700; color: #ffffff;">${release.title || `SIGANALYZER Release v${release.version}`}</h1>
          </div>
          
          <div class="card card-telemetry text-right">
            <div class="tech-label">RELEASE DATE</div>
            <div class="tech-value">${release.releaseDate}</div>
          </div>
        </div>

        <p style="font-size: 1.05rem; color: var(--text-secondary); line-height: 1.6; max-width: 800px; margin-bottom: 1.5rem;">
          ${release.description}
        </p>

        <div class="font-mono text-muted" style="font-size: 0.8rem;">
          SUPPORTED PLATFORMS: Windows (x64, ARM64) • macOS (Universal) • Linux (x86_64, aarch64)
        </div>
      </div>

      <!-- What's New & Highlights -->
      <div class="card p-6 mb-8" style="border: 1px solid var(--border-default);">
        <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem;" class="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span>What's New in v${release.version}</span>
        </h2>
        <ul style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6;">
          ${whatsNewHtml}
        </ul>
      </div>

      <!-- Artifacts & Download Options Table -->
      <div class="card p-6 mb-8" style="border: 1px solid var(--border-default); overflow-x: auto;">
        <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">
          Desktop Release Artifacts
        </h2>
        <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
          Official package distributions for Windows, macOS, and Linux.
        </p>

        <table style="width: 100%; text-align: left; font-size: 0.875rem;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-default); color: var(--text-muted); font-family: var(--font-mono); font-size: 0.75rem;">
              <th style="padding: 0.75rem;">PLATFORM</th>
              <th style="padding: 0.75rem;">ARCHITECTURE</th>
              <th style="padding: 0.75rem;">FORMAT</th>
              <th style="padding: 0.75rem;">PACKAGE FILE</th>
              <th style="padding: 0.75rem;">SIZE</th>
              <th style="padding: 0.75rem;">ACTION</th>
            </tr>
          </thead>
          <tbody>
            ${artifactsHtml}
          </tbody>
        </table>

        <!-- Checksum information -->
        <div class="mt-6 p-4 rounded" style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.08); font-family: var(--font-mono); font-size: 0.78rem;">
          <div class="flex items-center justify-between mb-2 flex-wrap gap-2">
            <span class="text-cyan font-bold">SHA-256 CRYPTOGRAPHIC INTEGRITY:</span>
            <span class="text-muted">
              ${artifactsWithChecksums.length > 0 ? `${artifactsWithChecksums.length} HASHES PUBLISHED` : 'Status: Checksum not available yet.'}
            </span>
          </div>

          ${artifactsWithChecksums.length > 0 ? `
            <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem;">
              ${artifactsWithChecksums.map(a => `
                <div style="padding: 6px 10px; background: rgba(0,0,0,0.5); border-radius: 4px; border: 1px solid rgba(255,255,255,0.05);">
                  <div class="text-emerald" style="font-weight: 700;">${a.fileName}</div>
                  <div style="color: var(--accent-cyan); word-break: break-all; font-size: 0.72rem;">${a.checksum}</div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div style="color: var(--text-muted); line-height: 1.5;">
              Official SHA-256 hashes are computed and published when release binaries are tagged in the GitHub repository. Never verify downloads using unverified third-party sources.
            </div>
          `}
        </div>
      </div>

      <!-- Known Issues -->
      ${release.knownIssues && release.knownIssues.length > 0 ? `
        <div class="card p-6 mb-8" style="border: 1px solid var(--border-default);">
          <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem;" class="flex items-center gap-2 text-amber">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>Known Technical Issues & Constraints</span>
          </h2>
          <ul style="display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
            ${knownIssuesHtml}
          </ul>
        </div>
      ` : ''}

    </main>
  `;
}

/**
 * 4. VERSION NOT FOUND FALLBACK
 */
function renderVersionNotFoundPage(version) {
  return `
    <main class="container text-center" style="padding-top: calc(var(--nav-height) + 5rem); padding-bottom: 6rem;">
      <div class="card p-8 max-w-lg mx-auto" style="border: 1px solid var(--border-accent-amber); max-width: 560px; margin: 0 auto;">
        <div class="badge badge-amber mb-4 font-mono">STATUS: VERSION_NOT_FOUND</div>
        <h1 class="hero-title mb-3" style="font-size: 2.2rem;">Release Not Found</h1>
        <p class="text-secondary text-sm mb-6">
          The requested release tag <strong>"${version}"</strong> is not cataloged in the GitHub release registry.
        </p>
        <div class="flex items-center justify-center gap-4">
          <a href="#/downloads/releases" class="btn btn-primary">Browse All Releases Archive</a>
          <a href="#/downloads" class="btn btn-secondary">Download Center</a>
        </div>
      </div>
    </main>
  `;
}
