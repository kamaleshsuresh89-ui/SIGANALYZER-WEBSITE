/**
 * SIGANALYZER CapabilitiesPage
 * Detailed breakdown of modulation families, SDR hardware, and file formats.
 */

export function renderCapabilitiesPage() {
  const modulations = [
    {
      family: 'Phase Shift Keying (PSK)',
      schemes: ['BPSK', 'QPSK', 'π/4-DQPSK', '8-PSK'],
      status: 'Implemented',
      desc: 'Gardner symbol timing recovery, Costas carrier loop, and Mth-power phase constellation clustering.'
    },
    {
      family: 'Frequency Shift Keying (FSK)',
      schemes: ['2-FSK', '4-FSK', 'GFSK (Gaussian)', 'MSK (Minimum Shift)'],
      status: 'Implemented',
      desc: 'Instantaneous frequency derivative discriminator, bimodal/quadrimodal PSD peak extraction.'
    },
    {
      family: 'Quadrature Amplitude (QAM)',
      schemes: ['16-QAM', '64-QAM (Planned)'],
      status: 'Core Engine',
      desc: 'Multi-ring constellation analysis, EVM calculation, and decision directed slicing.'
    },
    {
      family: 'Amplitude Shift Keying (ASK)',
      schemes: ['OOK (On-Off Keying)', '2-ASK', '4-ASK'],
      status: 'Implemented',
      desc: 'Envelope detection, threshold slicing, and burst duty-cycle characterization.'
    },
    {
      family: 'Analog & Unmodulated (CW)',
      schemes: ['Continuous Wave (CW)', 'AM / FM Baseband'],
      status: 'Implemented',
      desc: 'Carrier frequency offset measurement, power spectral density peak tracking.'
    }
  ];

  const cardsHtml = modulations.map(m => `
    <div class="card p-6" style="border: 1px solid var(--border-default);">
      <div class="flex items-center justify-between mb-3">
        <span class="badge ${m.status === 'Implemented' ? 'badge-emerald' : 'badge-cyan'}">${m.status}</span>
        <span class="font-mono text-muted" style="font-size: 0.75rem;">MODULATION FAMILY</span>
      </div>
      <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">${m.family}</h3>
      <div class="flex flex-wrap gap-2 mb-3">
        ${m.schemes.map(s => `<span class="code-inline" style="font-size: 0.78rem;">${s}</span>`).join('')}
      </div>
      <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.55;">${m.desc}</p>
    </div>
  `).join('');

  return `
    <main class="container" style="padding-top: calc(var(--nav-height) + 2.5rem); padding-bottom: 5rem;">
      <div class="text-center mb-10">
        <div class="badge badge-cyan mb-3">ANALYSIS SPECIFICATIONS</div>
        <h1 class="hero-title mb-3" style="font-size: clamp(2.2rem, 5vw, 3.5rem);">
          Supported Signals & Modulations
        </h1>
        <p class="section-desc mx-auto" style="margin-left: auto; margin-right: auto;">
          SIGANALYZER is designed to analyze both standard telecommunications standards and unknown industrial/IoT waveforms captured in the wild.
        </p>
      </div>

      <!-- Modulation Grid -->
      <div class="mb-12">
        <h2 class="section-title mb-4" style="font-size: 1.5rem;">Modulation Schemes</h2>
        <div class="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3 gap-5">
          ${cardsHtml}
        </div>
      </div>

      <!-- Hardware & Format Specifications -->
      <div class="grid grid-cols-1 lg-grid-cols-2 gap-6">
        
        <div class="card p-6" style="border: 1px solid var(--border-default);">
          <div class="font-mono text-cyan mb-2" style="font-size: 0.8rem; font-weight: 700;">SUPPORTED SDR HARDWARE SOURCES</div>
          <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.75rem;">Universal Baseband Compatibility</h3>
          <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem;">
            SIGANALYZER ingests recorded captures produced by any standard Software Defined Radio device:
          </p>
          <ul style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.875rem; color: var(--text-secondary);">
            <li>• <strong>RTL-SDR (v3/v4):</strong> 8-bit unsigned I/Q up to 2.4 MSps</li>
            <li>• <strong>HackRF One:</strong> 8-bit signed I/Q up to 20 MSps</li>
            <li>• <strong>LimeSDR / BladeRF:</strong> 12-bit / 16-bit signed I/Q up to 40 MSps</li>
            <li>• <strong>Ettus USRP (B200/N210):</strong> 16-bit complex integer & 32-bit float</li>
            <li>• <strong>Airspy R2 / HF+:</strong> High-dynamic range baseband recordings</li>
          </ul>
        </div>

        <div class="card p-6" style="border: 1px solid var(--border-default);">
          <div class="font-mono text-emerald mb-2" style="font-size: 0.8rem; font-weight: 700;">CONTAINER SPECIFICATIONS</div>
          <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.75rem;">File Format Ingestion</h3>
          <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem;">
            Both tagged container formats and raw headerless binary dumps are supported:
          </p>
          <ul style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.875rem; color: var(--text-secondary);">
            <li>• <strong>.wav (RIFF container):</strong> Mono and 2-channel stereo quadrature I/Q</li>
            <li>• <strong>.iq (Complex Float32):</strong> Interleaved IEEE 754 32-bit floats [I0, Q0, I1, Q1...]</li>
            <li>• <strong>.iq (Complex Int16):</strong> Interleaved 16-bit signed integers</li>
            <li>• <strong>.bin / .dat:</strong> Headerless raw byte arrays with configurable sample rates</li>
          </ul>
        </div>

      </div>

    </main>
  `;
}
