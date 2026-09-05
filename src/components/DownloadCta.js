/**
 * SIGANALYZER DownloadCta Component
 * Home page conversion block powered by centralized release data architecture.
 * Desktop Application Only: Windows, macOS, Linux.
 */

import { getLatestStableRelease, detectUserDesktopPlatform, PLATFORMS, RELEASE_STATUS } from '../data/releases.js';

export function renderDownloadCta() {
  const latest = getLatestStableRelease();
  const detectedPlatform = detectUserDesktopPlatform();

  const platformCardsHtml = Object.values(PLATFORMS).map(plat => {
    const isDetected = detectedPlatform && plat.id === detectedPlatform.id;
    // Find artifacts for this platform
    const platformArtifacts = latest.artifacts.filter(a => a.platform === plat.id);
    const hasAvailable = platformArtifacts.some(a => a.available && a.downloadUrl);

    return `
      <div class="card p-6 text-left" style="background: rgba(14, 20, 32, 0.75); border: 1px solid ${isDetected ? 'var(--border-accent-cyan)' : 'var(--border-default)'}; position: relative; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          ${isDetected ? `
            <span class="badge badge-cyan mb-2" style="font-size: 0.65rem;">
              DETECTED DESKTOP OS
            </span>
          ` : `
            <span class="font-mono text-muted mb-2" style="font-size: 0.72rem; display: block;">
              DESKTOP OS
            </span>
          `}
          
          <div class="flex items-center gap-2 mb-1" style="font-weight: 700; font-size: 1.25rem;">
            <span>${plat.name}</span>
          </div>

          <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.75rem;">
            ${plat.tagline}
          </div>

          <div class="font-mono" style="font-size: 0.76rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.25rem;">
            <div><strong>Architectures:</strong> ${plat.supportedArchs.join(', ')}</div>
            <div><strong>Expected Formats:</strong> ${plat.expectedFormats.join(' ')}</div>
          </div>
        </div>

        <div class="pt-4" style="border-top: 1px solid var(--border-subtle);">
          <div class="flex items-center justify-between gap-2">
            <span class="badge ${hasAvailable ? 'badge-emerald' : 'badge-outline'}" style="font-size: 0.7rem;">
              ${hasAvailable ? 'Available' : 'Coming Soon'}
            </span>
            <a href="#/downloads/releases/v${latest.version}" class="btn ${isDetected ? 'btn-primary' : 'btn-secondary'} btn-sm">
              View Release
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <section class="section-spacing" id="download-cta" style="position: relative; overflow: hidden;">
      <div class="ambient-glow-cyan" style="bottom: -100px; left: 50%; transform: translateX(-50%); opacity: 0.4;"></div>

      <div class="container" style="position: relative; z-index: 1;">
        
        <div class="card card-glass p-8 text-center" style="max-width: 1040px; margin: 0 auto; border: 1px solid var(--border-accent-cyan); box-shadow: var(--shadow-glow-cyan);">
          
          <div class="badge badge-cyan mb-3">
            DESKTOP SOFTWARE DISTRIBUTION
          </div>

          <h2 class="hero-title mb-3" style="font-size: clamp(2rem, 4vw, 3rem);">
            Download SIGANALYZER
          </h2>

          <p class="section-desc mx-auto mb-6" style="margin-left: auto; margin-right: auto;">
            Professional desktop signal intelligence software for <strong>Windows, macOS, and Linux</strong>. Operates 100% offline on your device with permanent version archiving.
          </p>

          <!-- Current Release Indicator -->
          <div class="card card-telemetry mb-8 inline-flex items-center gap-6 mx-auto text-left flex-wrap" style="max-width: 680px;">
            <div>
              <span class="tech-label">LATEST STABLE:</span>
              <div class="tech-value text-cyan">v${latest.version}</div>
            </div>
            <div>
              <span class="tech-label">CHANNEL:</span>
              <div class="tech-value" style="text-transform: uppercase;">${latest.channel}</div>
            </div>
            <div>
              <span class="tech-label">STATUS:</span>
              <div class="tech-value text-amber" style="text-transform: uppercase;">
                ${latest.status === RELEASE_STATUS.COMING_SOON ? 'Coming Soon' : latest.status}
              </div>
            </div>
            <div>
              <span class="tech-label">SECURITY:</span>
              <div class="tech-value text-emerald">SHA-256 Verified</div>
            </div>
          </div>

          <!-- Desktop Platforms Grid (3 Columns) -->
          <div class="grid grid-cols-1 md-grid-cols-3 gap-5 mb-8">
            ${platformCardsHtml}
          </div>

          <!-- Direct Link to Download Center -->
          <div class="flex items-center justify-center gap-4 flex-wrap">
            <a href="#/downloads" class="btn btn-primary btn-lg">
              <span>Open SIGANALYZER Download Center</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </a>
            <a href="#/downloads/releases" class="btn btn-secondary btn-lg">
              <span>View All Releases Archive</span>
            </a>
          </div>

          <div class="mt-4 font-mono text-muted" style="font-size: 0.78rem;">
            Desktop application for Windows, macOS, and Linux. No cloud upload required.
          </div>

        </div>

      </div>
    </section>
  `;
}
