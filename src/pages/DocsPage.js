/**
 * SIGANALYZER DocsPage
 * Comprehensive technical documentation architecture with 11 core sections.
 */

export function renderDocsPage(subTopic = '') {
  const topics = [
    { id: 'getting-started', title: 'Getting Started', desc: 'Core concepts, first signal load, and platform tour.' },
    { id: 'installation', title: 'Installation & Setup', desc: 'Running SIGANALYZER on Windows, macOS, and Linux.' },
    { id: 'formats', title: 'Supported Formats', desc: 'IQ binary structures, RIFF/WAV, sample packing, and endianness.' },
    { id: 'signal-analysis', title: 'Signal Analysis Engine', desc: 'Pre-filtering, DC cancellation, AGC, and FFT parameters.' },
    { id: 'parameters', title: 'Parameter Reference', desc: 'Comprehensive dictionary of the 40+ extractable RF metrics.' },
    { id: 'modulation', title: 'Modulation Classification', desc: 'Higher-order cumulants, constellation maps, and decision trees.' },
    { id: 'demodulation', title: 'Demodulation Systems', desc: 'Costas loops, Gardner symbol timing, and symbol slicers.' },
    { id: 'bitstream', title: 'Bitstream Forensics', desc: 'Entropy, transition densities, run-length metrics, and de-scrambling.' },
    { id: 'protocol', title: 'Protocol Discovery', desc: 'Sync words, preamble correlation, framing boundaries, and CRC.' },
    { id: 'reports', title: 'Automated Reports', desc: 'Exporting forensic HTML/PDF summaries with embedded plots.' },
    { id: 'troubleshooting', title: 'Troubleshooting & FAQ', desc: 'Common SDR capture errors, low SNR limits, and solutions.' }
  ];

  const currentTopicId = subTopic || 'getting-started';
  const currentTopic = topics.find(t => t.id === currentTopicId) || topics[0];

  const sidebarLinksHtml = topics.map(t => `
    <li>
      <a href="#/docs?topic=${t.id}" class="nav-link ${t.id === currentTopic.id ? 'active' : ''}" style="display: block; padding: 0.5rem 0.75rem; border-radius: var(--radius-sm); font-size: 0.875rem;">
        ${t.title}
      </a>
    </li>
  `).join('');

  return `
    <main class="container" style="padding-top: calc(var(--nav-height) + 2.5rem); padding-bottom: 5rem;">
      <div class="grid grid-cols-1 lg-grid-cols-4 gap-8">
        
        <!-- Sidebar Navigation -->
        <aside class="card p-4" style="height: fit-content; border: 1px solid var(--border-default);">
          <div class="font-mono text-cyan mb-3" style="font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">
            DOCUMENTATION SITEMAP
          </div>
          <ul style="display: flex; flex-direction: column; gap: 0.25rem;">
            ${sidebarLinksHtml}
          </ul>
        </aside>

        <!-- Main Content Area -->
        <section class="lg-grid-cols-3" style="grid-column: span 3;">
          <div class="card card-glass p-8" style="border: 1px solid var(--border-default);">
            
            <div class="flex items-center gap-2 font-mono text-cyan mb-2" style="font-size: 0.75rem;">
              <span>DOCS</span>
              <span>/</span>
              <span>${currentTopic.title.toUpperCase()}</span>
            </div>

            <h1 class="hero-title mb-4" style="font-size: clamp(2rem, 4vw, 2.75rem);">
              ${currentTopic.title}
            </h1>

            <p class="section-desc mb-6" style="font-size: 1.1rem;">
              ${currentTopic.desc}
            </p>

            <div style="border-top: 1px solid var(--border-subtle); padding-top: 1.5rem; line-height: 1.7; color: var(--text-secondary); font-size: 0.95rem;">
              
              <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem;">Section Overview</h3>
              <p class="mb-4">
                This section provides technical guidance on <strong>${currentTopic.title}</strong> within the SIGANALYZER automated signal intelligence engine.
              </p>

              <div class="card card-telemetry mb-6">
                <div class="text-cyan font-bold mb-1">OFFLINE EXECUTION SPECIFICATION:</div>
                <div style="color: var(--text-secondary); font-size: 0.85rem;">
                  All calculations associated with ${currentTopic.title.toLowerCase()} execute strictly in local process memory. No remote network calls or cloud telemetry endpoints are invoked.
                </div>
              </div>

              <h4 style="font-size: 1.05rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.5rem;">Key Engineering Topics Covered:</h4>
              <ul style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem; padding-left: 1.25rem; list-style-type: square;">
                <li>Mathematical formulas and operational constraints.</li>
                <li>Recommended SDR sampling rates and bit depth configurations.</li>
                <li>Scientific certainty markers (DIRECT, MEASURED, ESTIMATED, INFERRED).</li>
                <li>Exporting telemetry and verification logs to JSON/PDF reports.</li>
              </ul>

              <div class="p-4 rounded-md" style="background: rgba(0, 240, 255, 0.05); border: 1px solid var(--border-accent-cyan); font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-cyan);">
                STATUS: Specification documented for Smart India Hackathon Technical Preview. Full API reference and manual pages will expand in Phase 2.
              </div>

            </div>

          </div>
        </section>

      </div>
    </main>
  `;
}
