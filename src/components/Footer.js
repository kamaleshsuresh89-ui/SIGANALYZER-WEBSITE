/**
 * SIGANALYZER Footer Component
 * Professional engineering footer for desktop signal intelligence software.
 * Strictly desktop application: Windows • macOS • Linux.
 */

export function renderFooter() {
  const currentYear = new Date().getFullYear();

  return `
    <footer class="site-footer">
      <div class="container">
        
        <div class="footer-grid">
          
          <!-- Column 1: Brand & Positioning -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <div class="brand-glyph" style="width: 28px; height: 28px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M2 12h3l3-7 4 14 3-8 3 4h4" />
                </svg>
              </div>
              <span style="font-family: var(--font-mono); font-weight: 700; font-size: 1.15rem; letter-spacing: -0.02em;">
                SIGANALYZER<span class="text-cyan">.</span>
              </span>
            </div>
            
            <p class="font-mono text-cyan mb-2" style="font-size: 0.8rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">
              Desktop Signal Intelligence Software
            </p>
            
            <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6; max-width: 340px; margin-bottom: 1.5rem;">
              Automated IQ & WAV signal parameter extraction, modulation classification, and protocol discovery for Windows, macOS, and Linux. Developed for Smart India Hackathon.
            </p>

            <div class="inline-flex items-center gap-2 font-mono" style="font-size: 0.72rem; color: var(--text-muted); background: rgba(255, 255, 255, 0.04); padding: 4px 10px; border-radius: var(--radius-xs); border: 1px solid var(--border-subtle);">
              <span class="pulse-dot" style="width: 6px; height: 6px;"></span>
              <span>APPLICATION TARGETS: WINDOWS • MACOS • LINUX</span>
            </div>
          </div>

          <!-- Column 2: Architecture & Platform -->
          <div>
            <div class="footer-col-title">Desktop Software</div>
            <ul class="footer-link-list">
              <li><a href="#/downloads" class="footer-link">Download Center</a></li>
              <li><a href="#/downloads/latest" class="footer-link">Latest Stable Release</a></li>
              <li><a href="#/downloads/releases" class="footer-link">All Releases Archive</a></li>
              <li><a href="#/features" class="footer-link">Feature Matrix</a></li>
              <li><a href="#/how-it-works" class="footer-link">14-Stage DSP Pipeline</a></li>
              <li><a href="#/capabilities" class="footer-link">Modulation Specifications</a></li>
              <li><a href="#/demo" class="footer-link">Application Screenshots & Demo</a></li>
            </ul>
          </div>

          <!-- Column 3: Documentation & Research -->
          <div>
            <div class="footer-col-title">Documentation</div>
            <ul class="footer-link-list">
              <li><a href="#/docs" class="footer-link">Documentation Hub</a></li>
              <li><a href="#/docs?topic=getting-started" class="footer-link">Getting Started</a></li>
              <li><a href="#/docs?topic=installation" class="footer-link">Desktop Installation</a></li>
              <li><a href="#/docs?topic=formats" class="footer-link">IQ & WAV Formats</a></li>
              <li><a href="#/docs?topic=parameters" class="footer-link">Parameter Reference</a></li>
              <li><a href="#/faq" class="footer-link">Technical FAQ</a></li>
            </ul>
          </div>

          <!-- Column 4: Project & Trust -->
          <div>
            <div class="footer-col-title">Initiative & Trust</div>
            <ul class="footer-link-list">
              <li><a href="#/about" class="footer-link">About SIGANALYZER & SIH</a></li>
              <li><a href="#/privacy" class="footer-link">Offline-First Privacy Policy</a></li>
              <li><a href="https://github.com/kamaleshsuresh89-ui/SIGANALYZER" target="_blank" rel="noopener noreferrer" class="footer-link" style="display: flex; align-items: center; gap: 0.4rem;"><span>GitHub</span> <span class="badge badge-outline" style="font-size: 0.6rem;">Source</span></a></li>
              <li><a href="#/about" class="footer-link">Contact & Research Team</a></li>
              <li><span class="footer-link" style="color: var(--text-dim);">License: Open Research (Pending)</span></li>
            </ul>
          </div>

        </div>

        <!-- Bottom Bar -->
        <div class="footer-bottom">
          <div>
            © ${currentYear} SIGANALYZER Project. Smart India Hackathon Initiative.
          </div>
          <div class="font-mono flex items-center gap-4">
            <a href="#/privacy" style="color: var(--text-muted);">Data Privacy</a>
            <span>•</span>
            <a href="#/downloads" style="color: var(--text-muted);">Windows • macOS • Linux</a>
            <span>•</span>
            <span style="color: var(--accent-emerald);">100% Offline Edge Processing</span>
          </div>
        </div>

      </div>
    </footer>
  `;
}
