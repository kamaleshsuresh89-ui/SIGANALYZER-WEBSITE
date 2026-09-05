/**
 * SIGANALYZER ValueFlow Component
 * 8-step visual value proposition showing transformation from raw captures to reports.
 */

export function renderValueFlow() {
  const steps = [
    { num: '01', title: 'Raw Signal', subtitle: '.iq / .wav buffers', desc: 'Unstructured binary captures from SDRs or field recordings.' },
    { num: '02', title: 'Auto Analysis', subtitle: 'Container & DSP sanity', desc: 'Hardware format parsing, DC removal, and gain leveling.' },
    { num: '03', title: 'Signal Parameters', subtitle: 'Spectral & temporal', desc: 'Precise extraction of RMS, PAPR, bandwidth, and noise floor.' },
    { num: '04', title: 'Mod & Sync', subtitle: 'Timing & carrier lock', desc: 'Cumulant-based classification (PSK/FSK/QAM) and Costas loop lock.' },
    { num: '05', title: 'Demodulation', subtitle: 'Decision slicing', desc: 'Constellation centroid slicing into raw binary symbols.' },
    { num: '06', title: 'Bitstream', subtitle: 'Forensic entropy', desc: 'Transition density, run-length checks, and de-scrambling.' },
    { num: '07', title: 'Protocol Insights', subtitle: 'Framing & CRC', desc: 'Sync word discovery, packet boundary inference, and checksum testing.' },
    { num: '08', title: 'Technical Report', subtitle: 'Forensic documentation', desc: 'Self-contained comprehensive PDF/HTML reports generated on-device.' }
  ];

  const stepsHtml = steps.map((s, idx) => `
    <div class="flow-step-card">
      <div class="flow-step-number">${s.num}</div>
      <div class="flow-step-name">${s.title}</div>
      <div style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--accent-cyan); margin-top: 0.2rem;">${s.subtitle}</div>
    </div>
    ${idx < steps.length - 1 ? `
      <div class="flow-arrow" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    ` : ''}
  `).join('');

  return `
    <section class="section-spacing" style="padding-top: 2rem; padding-bottom: 4rem;">
      <div class="container">
        
        <div class="text-center mb-8">
          <span class="section-subtitle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            TRANSFORMATION FLOW
          </span>
          <h2 class="section-title mb-3">From Raw Data to Protocol Intelligence</h2>
          <p class="section-desc mx-auto" style="margin-left: auto; margin-right: auto;">
            Manual signal reverse-engineering requires dozens of separate fragmented tools. SIGANALYZER unifies the entire workflow into an automated, deterministic signal intelligence pipeline.
          </p>
        </div>

        <!-- Flow Diagram Container -->
        <div class="card card-glass p-6" style="border: 1px solid var(--border-default);">
          <div class="flow-diagram">
            ${stepsHtml}
          </div>

          <div class="mt-6 pt-4 text-center" style="border-top: 1px solid var(--border-subtle); font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary);">
            <span class="text-emerald font-bold">AUTOMATED PIPELINE</span> • Reduces manual RF analysis cycle from hours to milliseconds.
          </div>
        </div>

      </div>
    </section>
  `;
}
