/**
 * SIGANALYZER ExplainabilityCard Component
 * "Result + Confidence + Evidence + Method" telemetry inspector proving algorithmic transparency.
 */

export function renderExplainabilityCard() {
  const scenarios = [
    {
      id: 'qpsk',
      title: 'Modulation Classification (QPSK)',
      result: 'QPSK (Quadrature Phase Shift Keying)',
      confidence: 96.4,
      status: { label: 'INFERRED', class: 'status-inferred' },
      evidence: [
        '4 dominant constellation centroids detected in I/Q phase plane with radial symmetry.',
        'Gardner symbol timing variance < 0.012, confirming stable symbol baud rate at 100.0 kBaud.',
        'Mth-power (M=4) nonlinear phase extraction collapses into a single discrete carrier spectral line.',
        'Normalized fourth-order cumulant C42 = -1.98 (consistent with theoretical QPSK C42 = -2.00).'
      ],
      method: 'Fourth-Order Cumulant Decision Tree (C40/C42) & Cyclostationary Spectral Correlation'
    },
    {
      id: 'fsk',
      title: 'Binary Frequency Shift Keying (2-FSK)',
      result: '2-FSK (Continuous Phase Frequency Shift Keying)',
      confidence: 98.2,
      status: { label: 'INFERRED', class: 'status-inferred' },
      evidence: [
        'Bimodal Power Spectral Density displaying dual distinct energy lobes at f1 = -25 kHz and f2 = +25 kHz.',
        'Zero phase discontinuities detected across frequency transitions (Continuous Phase modulation).',
        'Frequency deviation Δf = 50.0 kHz, yielding modulation index h = 0.5 (MSK subclass).',
        'Instantaneous envelope variance < 2.5%, indicating constant amplitude envelope.'
      ],
      method: 'Instantaneous Frequency Derivative Analysis & Welch PSD Peak Identification'
    },
    {
      id: 'preamble',
      title: 'Protocol Preamble & Framing',
      result: 'AX.25 / HDLC Packet Frame Structure',
      confidence: 94.7,
      status: { label: 'PROBABLE', class: 'status-probable' },
      evidence: [
        'Periodic 0x7E (01111110b) flag octet discovered at bit offset 0 and 256.',
        'Bit stuffing rule observed (zero inserted after 5 contiguous ones) across the payload section.',
        'CRC-16-CCITT polynomial (0x1021) computed over payload successfully validates remainder 0xF0B8.',
        'Standard 64-byte fixed frame interval matched across 12 consecutive transmission bursts.'
      ],
      method: 'Sliding Correlator Windowing & Cyclic Redundancy Check (CRC) Polynomial Verification'
    }
  ];

  return `
    <section class="section-spacing" id="explainability-section" style="background: rgba(8, 12, 20, 0.6);">
      <div class="container">
        
        <div class="text-center mb-10">
          <span class="section-subtitle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            SCIENTIFIC RIGOR
          </span>
          <h2 class="section-title mb-3">No Black Boxes. Full Explainability.</h2>
          <p class="section-desc mx-auto" style="margin-left: auto; margin-right: auto;">
            Engineering decisions require verifiable evidence. SIGANALYZER never provides an opaque label without transparent mathematical proof and uncertainty quantification.
          </p>
        </div>

        <!-- Formula Header -->
        <div class="flex items-center justify-center gap-2 mb-8 flex-wrap font-mono" style="font-size: clamp(0.85rem, 2vw, 1.15rem); color: var(--text-secondary);">
          <span class="card p-2 px-3 text-cyan" style="border-color: var(--border-accent-cyan);">Result</span>
          <span>+</span>
          <span class="card p-2 px-3 text-emerald" style="border-color: var(--border-accent-emerald);">Confidence</span>
          <span>+</span>
          <span class="card p-2 px-3 text-amber" style="border-color: var(--border-accent-amber);">Evidence</span>
          <span>+</span>
          <span class="card p-2 px-3 text-indigo" style="border-color: rgba(99, 102, 241, 0.4);">Method</span>
        </div>

        <!-- Scenario Selector Tabs -->
        <div class="tab-group mb-6 justify-center" id="explain-tabs">
          <button class="tab-btn explain-tab-btn active" data-scenario="qpsk">Scenario A: QPSK Modulation</button>
          <button class="tab-btn explain-tab-btn" data-scenario="fsk">Scenario B: 2-FSK Shift Keying</button>
          <button class="tab-btn explain-tab-btn" data-scenario="preamble">Scenario C: Protocol Framing</button>
        </div>

        <!-- Telemetry Inspector Card -->
        <div class="card card-glass p-8" style="border: 1px solid var(--border-accent-cyan); box-shadow: var(--shadow-glow-cyan);" id="explain-card">
          
          <div class="flex items-center justify-between mb-6 flex-wrap gap-3" style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem;">
            <div>
              <span class="tech-label" id="explain-title-label">CLASSIFICATION RESULT</span>
              <div style="font-size: 1.4rem; font-weight: 700; color: #ffffff;" id="explain-result">
                QPSK (Quadrature Phase Shift Keying)
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="status-pill status-inferred" id="explain-status">INFERRED</span>
              <div class="font-mono text-cyan" style="font-size: 1.4rem; font-weight: 700;" id="explain-conf">
                96.4%
              </div>
            </div>
          </div>

          <!-- Confidence Meter Bar -->
          <div class="mb-6">
            <div class="flex justify-between font-mono mb-1" style="font-size: 0.72rem; color: var(--text-muted);">
              <span>CONFIDENCE INDEX</span>
              <span id="explain-conf-bar-text">96.4% STATISTICAL SIGNIFICANCE</span>
            </div>
            <div style="height: 6px; background: rgba(255, 255, 255, 0.08); border-radius: 3px; overflow: hidden;">
              <div style="height: 100%; width: 96.4%; background: linear-gradient(90deg, #00f0ff, #10b981); transition: width 0.4s ease;" id="explain-conf-bar"></div>
            </div>
          </div>

          <!-- Evidence List -->
          <div class="mb-6">
            <div class="tech-label mb-2 text-amber flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              VERIFIED MATHEMATICAL EVIDENCE
            </div>
            <ul id="explain-evidence-list" style="display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.9rem; color: var(--text-secondary);">
              <li class="flex items-start gap-2">
                <span style="color: var(--accent-cyan); font-family: var(--font-mono);">[1]</span>
                <span>4 dominant constellation centroids detected in I/Q phase plane with radial symmetry.</span>
              </li>
              <li class="flex items-start gap-2">
                <span style="color: var(--accent-cyan); font-family: var(--font-mono);">[2]</span>
                <span>Gardner symbol timing variance &lt; 0.012, confirming stable symbol baud rate at 100.0 kBaud.</span>
              </li>
              <li class="flex items-start gap-2">
                <span style="color: var(--accent-cyan); font-family: var(--font-mono);">[3]</span>
                <span>Mth-power (M=4) nonlinear phase extraction collapses into a single discrete carrier spectral line.</span>
              </li>
              <li class="flex items-start gap-2">
                <span style="color: var(--accent-cyan); font-family: var(--font-mono);">[4]</span>
                <span>Normalized fourth-order cumulant C42 = -1.98 (consistent with theoretical QPSK C42 = -2.00).</span>
              </li>
            </ul>
          </div>

          <!-- Mathematical Method Footer -->
          <div class="p-4 rounded-md" style="background: rgba(0, 0, 0, 0.4); border: 1px solid var(--border-subtle); font-family: var(--font-mono); font-size: 0.8rem;">
            <span class="text-indigo" style="font-weight: 700;">DSP METHOD:</span>
            <span style="color: #cbd5e1;" id="explain-method">
              Fourth-Order Cumulant Decision Tree (C40/C42) & Cyclostationary Spectral Correlation
            </span>
          </div>

        </div>

      </div>
    </section>
  `;
}

export function initExplainabilityListeners() {
  const scenarios = {
    qpsk: {
      result: 'QPSK (Quadrature Phase Shift Keying)',
      confidence: '96.4%',
      confValue: 96.4,
      statusText: 'INFERRED',
      statusClass: 'status-inferred',
      evidence: [
        '4 dominant constellation centroids detected in I/Q phase plane with radial symmetry.',
        'Gardner symbol timing variance < 0.012, confirming stable symbol baud rate at 100.0 kBaud.',
        'Mth-power (M=4) nonlinear phase extraction collapses into a single discrete carrier spectral line.',
        'Normalized fourth-order cumulant C42 = -1.98 (consistent with theoretical QPSK C42 = -2.00).'
      ],
      method: 'Fourth-Order Cumulant Decision Tree (C40/C42) & Cyclostationary Spectral Correlation'
    },
    fsk: {
      result: '2-FSK (Continuous Phase Frequency Shift Keying)',
      confidence: '98.2%',
      confValue: 98.2,
      statusText: 'INFERRED',
      statusClass: 'status-inferred',
      evidence: [
        'Bimodal Power Spectral Density displaying dual distinct energy lobes at f1 = -25 kHz and f2 = +25 kHz.',
        'Zero phase discontinuities detected across frequency transitions (Continuous Phase modulation).',
        'Frequency deviation Δf = 50.0 kHz, yielding modulation index h = 0.5 (MSK subclass).',
        'Instantaneous envelope variance < 2.5%, indicating constant amplitude envelope.'
      ],
      method: 'Instantaneous Frequency Derivative Analysis & Welch PSD Peak Identification'
    },
    preamble: {
      result: 'AX.25 / HDLC Packet Frame Structure',
      confidence: '94.7%',
      confValue: 94.7,
      statusText: 'PROBABLE',
      statusClass: 'status-probable',
      evidence: [
        'Periodic 0x7E (01111110b) flag octet discovered at bit offset 0 and 256.',
        'Bit stuffing rule observed (zero inserted after 5 contiguous ones) across the payload section.',
        'CRC-16-CCITT polynomial (0x1021) computed over payload successfully validates remainder 0xF0B8.',
        'Standard 64-byte fixed frame interval matched across 12 consecutive transmission bursts.'
      ],
      method: 'Sliding Correlator Windowing & Cyclic Redundancy Check (CRC) Polynomial Verification'
    }
  };

  const tabs = document.querySelectorAll('.explain-tab-btn');
  const resultEl = document.getElementById('explain-result');
  const confEl = document.getElementById('explain-conf');
  const confBar = document.getElementById('explain-conf-bar');
  const confBarText = document.getElementById('explain-conf-bar-text');
  const statusEl = document.getElementById('explain-status');
  const listEl = document.getElementById('explain-evidence-list');
  const methodEl = document.getElementById('explain-method');

  if (!tabs.length || !resultEl) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const scKey = tab.getAttribute('data-scenario');
      const data = scenarios[scKey];
      if (!data) return;

      resultEl.textContent = data.result;
      confEl.textContent = data.confidence;
      if (confBar) confBar.style.width = `${data.confValue}%`;
      if (confBarText) confBarText.textContent = `${data.confidence} STATISTICAL SIGNIFICANCE`;
      
      if (statusEl) {
        statusEl.className = `status-pill ${data.statusClass}`;
        statusEl.textContent = data.statusText;
      }

      if (listEl) {
        listEl.innerHTML = data.evidence.map((ev, idx) => `
          <li class="flex items-start gap-2">
            <span style="color: var(--accent-cyan); font-family: var(--font-mono);">[${idx + 1}]</span>
            <span>${ev}</span>
          </li>
        `).join('');
      }

      if (methodEl) methodEl.textContent = data.method;
    });
  });
}
