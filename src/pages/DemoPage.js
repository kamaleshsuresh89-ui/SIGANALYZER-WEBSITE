/**
 * SIGANALYZER DemoPage
 * Interactive screenshots and walkthrough of the SIGANALYZER application UI.
 */

export function renderDemoPage() {
  const screens = [
    {
      id: 'spectrum',
      title: 'Spectral Analysis & Waterfall Inspector',
      desc: 'High-resolution FFT spectrum analyzer with peak markers, noise floor baseline, and 2D waterfall heat map.',
      telemetry: 'CF: 433.920 MHz | SPAN: 200 kHz | RBW: 976.5 Hz'
    },
    {
      id: 'constellation',
      title: 'I/Q Constellation & Demodulation Workspace',
      desc: 'Real-time In-Phase vs Quadrature phase-plane trajectory, EVM circle bounds, and symbol slicer outputs.',
      telemetry: 'MODULATION: QPSK | EVM: 3.12% RMS | MER: 30.1 dB'
    },
    {
      id: 'bitstream',
      title: 'Digital Bitstream Forensics & Hex Disassembler',
      desc: 'Decoded raw binary bitstreams, sync word highlight tags, and entropy distribution histograms.',
      telemetry: 'ENTROPY: 0.498 | PREAMBLE: 0xAA 0xAA | SYNC: 0xD3 0x91'
    },
    {
      id: 'report',
      title: 'Automated Forensic PDF/HTML Report Generator',
      desc: 'Export tamper-evident reports compiling all extracted parameters, spectral snapshots, and evidence logs.',
      telemetry: 'REPORT TYPE: FORENSIC COMPREHENSIVE | FORMAT: PDF / HTML'
    }
  ];

  const screensHtml = screens.map((s, idx) => `
    <div class="card p-6 mb-6" style="border: 1px solid var(--border-default);">
      <div class="flex items-center justify-between flex-wrap gap-2 mb-3">
        <div>
          <span class="font-mono text-cyan" style="font-size: 0.75rem; font-weight: 700;">WORKSPACE SCREEN 0${idx + 1}</span>
          <h3 style="font-size: 1.25rem; font-weight: 700;">${s.title}</h3>
        </div>
        <span class="badge badge-cyan">${s.telemetry}</span>
      </div>
      <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.25rem;">${s.desc}</p>
      
      <!-- Simulated Engineering UI Frame -->
      <div style="background: #04060a; border: 1px solid rgba(0, 240, 255, 0.2); border-radius: var(--radius-md); padding: 1.5rem; font-family: var(--font-mono); font-size: 0.8rem; color: #94a3b8;">
        <div class="flex items-center justify-between pb-2 mb-3" style="border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
          <div class="flex items-center gap-2">
            <span style="display:inline-block; width: 8px; height: 8px; border-radius: 50%; background: #f43f5e;"></span>
            <span style="display:inline-block; width: 8px; height: 8px; border-radius: 50%; background: #f59e0b;"></span>
            <span style="display:inline-block; width: 8px; height: 8px; border-radius: 50%; background: #10b981;"></span>
            <span style="color: #cbd5e1; margin-left: 0.5rem;">SIGANALYZER // ${s.id.toUpperCase()}</span>
          </div>
          <span class="text-cyan">LOCAL BUFFER: 49.16 MSAMPLES</span>
        </div>
        
        <div style="padding: 2rem; text-align: center; color: var(--text-muted);">
          <div class="mb-2" style="font-size: 1.1rem; color: var(--text-primary); font-family: var(--font-sans); font-weight: 600;">
            ${s.title} Simulated View
          </div>
          <p style="max-width: 500px; margin: 0 auto 1rem auto; font-size: 0.82rem;">
            Real screen capture captures and interactive telemetry replay will be linked when binary package v0.9.0 is packaged.
          </p>
          <a href="#/" class="btn btn-outline-cyan btn-sm">Inspect Live Interactive Canvas on Home</a>
        </div>
      </div>

    </div>
  `).join('');

  return `
    <main class="container" style="padding-top: calc(var(--nav-height) + 2.5rem); padding-bottom: 5rem;">
      <div class="text-center mb-10">
        <div class="badge badge-cyan mb-3">APPLICATION SHOWCASE</div>
        <h1 class="hero-title mb-3" style="font-size: clamp(2.2rem, 5vw, 3.5rem);">
          Interface & Demonstrations
        </h1>
        <p class="section-desc mx-auto" style="margin-left: auto; margin-right: auto;">
          A walkthrough of the SIGANALYZER desktop engineering interface, telemetry HUDs, and automated reporting systems.
        </p>
      </div>

      <div>
        ${screensHtml}
      </div>
    </main>
  `;
}
