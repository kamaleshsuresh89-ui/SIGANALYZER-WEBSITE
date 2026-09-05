/**
 * SIGANALYZER OfflineFirst Component
 * High-visibility offline-first architectural USP section.
 */

export function renderOfflineFirst() {
  const pillars = [
    {
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
      title: 'Local Device-Native DSP',
      desc: 'All mathematical transforms, FFTs, and neural cumulant classifiers execute directly on your local CPU or GPU cores.'
    },
    {
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`,
      title: 'Air-Gapped & Offline Ready',
      desc: 'Operate in isolated laboratory, defense, or RF-shielded environments with zero internet connection or remote dependencies.'
    },
    {
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
      title: 'No Cloud Upload of Captures',
      desc: 'Raw multi-gigabyte IQ files are processed locally via zero-copy memory buffers. Your proprietary signals never leave your drive.'
    },
    {
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
      title: 'Zero Forced Accounts or Tokens',
      desc: 'No mandatory logins, subscription phone-homes, or telemetry beacons. Install and run immediately without friction.'
    },
    {
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
      title: 'On-Device Forensic Reports',
      desc: 'Generate complete, tamper-evident HTML and PDF engineering documentation compiled entirely on your local machine.'
    },
    {
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
      title: 'ITAR & IP Protection',
      desc: 'Prevents intellectual property leaks, export control infractions, and confidential signal disclosure.'
    }
  ];

  const pillarsHtml = pillars.map(p => `
    <div class="card p-6" style="background: rgba(14, 20, 32, 0.7); border: 1px solid var(--border-default);">
      <div style="color: var(--accent-emerald); margin-bottom: 1rem;">
        ${p.icon}
      </div>
      <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem;">${p.title}</h3>
      <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.55;">${p.desc}</p>
    </div>
  `).join('');

  return `
    <section class="section-spacing" id="offline-first" style="background: linear-gradient(180deg, rgba(6, 8, 13, 1) 0%, rgba(10, 16, 24, 0.85) 50%, rgba(6, 8, 13, 1) 100%); border-top: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle); position: relative;">
      
      <!-- Ambient emerald glow -->
      <div class="ambient-glow-emerald" style="position: absolute; top: 20%; right: 5%; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%); pointer-events: none;"></div>

      <div class="container" style="position: relative; z-index: 1;">
        
        <div class="text-center mb-12">
          <div class="badge badge-emerald mb-3" style="font-size: 0.8rem; padding: 0.35rem 0.85rem;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            CONFIDENTIAL RF ARCHITECTURE
          </div>
          <h2 class="hero-title mb-4" style="font-size: clamp(2.2rem, 5vw, 3.75rem); line-height: 1.1;">
            Your signals stay on your device.
          </h2>
          <p class="section-desc mx-auto" style="margin-left: auto; margin-right: auto; font-size: 1.15rem;">
            Raw RF captures can contain mission-critical telecommunications, proprietary industrial telemetry, or classified waveforms. SIGANALYZER was engineered from day one with a strict <strong>offline-first, zero-cloud architecture</strong>.
          </p>
        </div>

        <!-- Architectural Comparison Grid -->
        <div class="grid grid-cols-1 md-grid-cols-2 gap-6 mb-12">
          
          <!-- Cloud Tools Dilemma -->
          <div class="card p-6" style="border: 1px solid rgba(244, 63, 94, 0.25); background: rgba(20, 10, 14, 0.4);">
            <div class="flex items-center gap-2 mb-3 text-rose font-mono" style="font-size: 0.85rem; font-weight: 700; color: #fb7185;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              COMMON CLOUD-DEPENDENT PARADIGM
            </div>
            <ul style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.875rem; color: #cbd5e1;">
              <li class="flex items-start gap-2">
                <span style="color: #fb7185; font-weight: bold;">✕</span>
                <span>Mandatory uploading of gigabyte IQ files over public internet pipes.</span>
              </li>
              <li class="flex items-start gap-2">
                <span style="color: #fb7185; font-weight: bold;">✕</span>
                <span>Signals parsed on multi-tenant remote clusters outside your control.</span>
              </li>
              <li class="flex items-start gap-2">
                <span style="color: #fb7185; font-weight: bold;">✕</span>
                <span>Risk of proprietary protocol exposure and regulatory non-compliance.</span>
              </li>
              <li class="flex items-start gap-2">
                <span style="color: #fb7185; font-weight: bold;">✕</span>
                <span>Inoperable in field vehicles, Faraday chambers, or offline testbenches.</span>
              </li>
            </ul>
          </div>

          <!-- SIGANALYZER Edge Model -->
          <div class="card p-6" style="border: 1px solid var(--border-accent-emerald); background: rgba(10, 24, 18, 0.5); box-shadow: var(--shadow-glow-emerald);">
            <div class="flex items-center gap-2 mb-3 font-mono text-emerald" style="font-size: 0.85rem; font-weight: 700;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              SIGANALYZER EDGE ARCHITECTURE
            </div>
            <ul style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.875rem; color: #f1f5f9;">
              <li class="flex items-start gap-2">
                <span style="color: var(--accent-emerald); font-weight: bold;">✓</span>
                <span>Zero network egress: 100% of binary parsing is performed in local RAM.</span>
              </li>
              <li class="flex items-start gap-2">
                <span style="color: var(--accent-emerald); font-weight: bold;">✓</span>
                <span>Instant turnaround without upload delays, bandwidth caps, or timeouts.</span>
              </li>
              <li class="flex items-start gap-2">
                <span style="color: var(--accent-emerald); font-weight: bold;">✓</span>
                <span>Strict data sovereignty: fully compliant with air-gapped lab policies.</span>
              </li>
              <li class="flex items-start gap-2">
                <span style="color: var(--accent-emerald); font-weight: bold;">✓</span>
                <span>All reports and bitstreams generated directly to local disk.</span>
              </li>
            </ul>
          </div>

        </div>

        <!-- 6 Pillars Grid -->
        <div class="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3 gap-5">
          ${pillarsHtml}
        </div>

      </div>
    </section>
  `;
}
