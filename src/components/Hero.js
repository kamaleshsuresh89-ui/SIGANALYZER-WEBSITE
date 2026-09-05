/**
 * SIGANALYZER Hero Component
 * Premium high-impact scientific headline, core value proposition & primary actions.
 */

export function renderHero() {
  return `
    <section class="section-spacing" style="padding-top: calc(var(--nav-height) + 3.5rem); padding-bottom: 3.5rem; position: relative; overflow: hidden;">
      <!-- Ambient Glow Orbs -->
      <div class="ambient-glow-cyan" style="top: -100px; left: 50%; transform: translateX(-50%); opacity: 0.6;"></div>

      <div class="container" style="position: relative; z-index: 1;">
        <div style="max-width: 920px; margin: 0 auto; text-align: center;">
          
          <!-- System Status Pill -->
          <div style="display: inline-flex; align-items: center; gap: 0.6rem; padding: 0.35rem 0.9rem; background: rgba(0, 240, 255, 0.08); border: 1px solid var(--border-accent-cyan); border-radius: var(--radius-full); margin-bottom: 1.75rem;">
            <div class="pulse-dot"></div>
            <span class="font-mono text-cyan" style="font-size: 0.78rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;">
              Smart India Hackathon • Signal Intelligence Platform
            </span>
          </div>

          <!-- Main Title -->
          <h1 class="hero-title mb-4">
            SIGANALYZER
          </h1>

          <!-- Technical Positioning Subtitle -->
          <p class="hero-subtitle mb-3">
            Automated IQ & WAV Signal Intelligence
          </p>

          <!-- Core Message -->
          <div class="hero-tagline mb-6 font-mono" style="color: #ffffff; letter-spacing: 0.04em;">
            Analyze<span class="text-cyan">.</span> Decode<span class="text-emerald">.</span> Understand<span class="text-amber">.</span>
          </div>

          <!-- Supporting Message -->
          <p class="section-desc mx-auto mb-8" style="margin-left: auto; margin-right: auto; font-size: 1.15rem; line-height: 1.65; color: var(--text-secondary);">
            Transform raw <span class="code-inline">.iq</span> and <span class="code-inline">.wav</span> signal captures into structured, actionable intelligence through automated parameter extraction, spectral profiling, modulation classification, constellation recovery, bitstream forensics, and protocol discovery.
          </p>

          <!-- Action CTAs -->
          <div class="flex items-center justify-center gap-4 md-flex-col" style="margin-bottom: 2.5rem;">
            <a href="#/downloads" class="btn btn-primary btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download SIGANALYZER</span>
            </a>
            
            <a href="#/capabilities" class="btn btn-secondary btn-lg">
              <span>Explore Capabilities</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>

          <!-- Telemetry Badges Strip -->
          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1.25rem; font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted);">
            <div class="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-emerald)" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              <span>100% On-Device Processing</span>
            </div>
            <div class="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              <span>Rigorous Scientific Evidence</span>
            </div>
            <div class="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-amber)" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              <span>No Cloud Upload Required</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  `;
}
