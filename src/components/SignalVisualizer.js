/**
 * SIGANALYZER SignalVisualizer Component
 * 60fps Lightweight Canvas 2D DSP Instrument.
 * Features:
 * - 4 interactive instruments: Spectrum Analyzer (FFT), Waterfall Display, I/Q Constellation, Time-Domain Waveform
 * - Zero external libraries
 * - IntersectionObserver lifecycle (0% CPU when out of view)
 * - HiDPI / Retina canvas scaling
 */

export function renderSignalVisualizer() {
  return `
    <section class="container" style="margin-bottom: 5rem;" aria-label="Interactive Signal Instrument">
      <div class="card card-glass p-6" style="border: 1px solid var(--border-accent-cyan); box-shadow: 0 10px 30px -10px rgba(0, 240, 255, 0.15);">
        
        <!-- Instrument Header Bar -->
        <div class="flex items-center justify-between mb-4 flex-wrap gap-3" style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem;">
          <div class="flex items-center gap-3">
            <div class="pulse-dot"></div>
            <div>
              <div class="font-mono text-cyan" style="font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">
                LIVE DSP SYNTHESIS ENGINE
              </div>
              <div style="font-size: 0.95rem; font-weight: 600;" id="instrument-active-label">
                Real-Time Spectrum Analyzer (Welch FFT)
              </div>
            </div>
          </div>

          <!-- Mode Selector Tabs -->
          <div class="tab-group" role="tablist" aria-label="Instrument Modes">
            <button class="tab-btn active" data-mode="spectrum" role="tab" aria-selected="true">
              Spectrum (FFT)
            </button>
            <button class="tab-btn" data-mode="waterfall" role="tab" aria-selected="false">
              Waterfall
            </button>
            <button class="tab-btn" data-mode="constellation" role="tab" aria-selected="false">
              I/Q Constellation
            </button>
            <button class="tab-btn" data-mode="timedomain" role="tab" aria-selected="false">
              Time Domain
            </button>
          </div>

          <!-- Controls -->
          <div class="flex items-center gap-2">
            <button class="btn btn-secondary btn-sm" id="btn-pause-viz" title="Toggle animation" aria-label="Pause DSP Visualization">
              <span id="pause-btn-text">Pause</span>
            </button>
          </div>
        </div>

        <!-- Canvas Container -->
        <div style="position: relative; width: 100%; height: 380px; background: #04060a; border-radius: var(--radius-md); overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.08);">
          <canvas id="dsp-canvas" style="width: 100%; height: 100%; display: block;" aria-label="Signal Processing Visualization"></canvas>

          <!-- On-Canvas Telemetry HUD -->
          <div style="position: absolute; bottom: 12px; left: 16px; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); pointer-events: none; background: rgba(4, 6, 10, 0.85); padding: 4px 10px; border-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.08);" id="hud-telemetry">
            CF: 433.920 MHz | SPAN: 200 kHz | RBW: 976.5 Hz | SNR: 28.5 dB
          </div>

          <div style="position: absolute; top: 12px; right: 16px; font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent-cyan); pointer-events: none; background: rgba(4, 6, 10, 0.85); padding: 4px 10px; border-radius: 4px; border: 1px solid rgba(0, 240, 255, 0.2);" id="hud-status">
            SAMPLE RATE: 20.00 MSPS • 32-BIT FLOAT
          </div>
        </div>

        <!-- Instrument Footer Legend -->
        <div class="flex items-center justify-between mt-3 font-mono text-secondary" style="font-size: 0.75rem; flex-wrap: wrap; gap: 1rem;">
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1.5">
              <span style="display:inline-block; width: 10px; height: 10px; background: var(--accent-cyan); border-radius: 2px;"></span>
              <span>Primary Carrier / I-Channel</span>
            </span>
            <span class="flex items-center gap-1.5">
              <span style="display:inline-block; width: 10px; height: 10px; background: var(--accent-emerald); border-radius: 2px;"></span>
              <span>Occupied Band / Q-Channel</span>
            </span>
            <span class="flex items-center gap-1.5">
              <span style="display:inline-block; width: 10px; height: 10px; background: var(--accent-amber); border-radius: 2px;"></span>
              <span>Peak Hold / Clusters</span>
            </span>
          </div>
          <div style="color: var(--text-muted);">
            Render Engine: Native HTML5 Canvas 2D (Zero Overhead)
          </div>
        </div>

      </div>
    </section>
  `;
}

/**
 * Controller for Canvas Animation Loop
 */
export function initSignalVisualizer() {
  const canvas = document.getElementById('dsp-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let currentMode = 'spectrum';
  let isRunning = true;
  let animId = null;
  let frame = 0;

  const hudTelemetry = document.getElementById('hud-telemetry');
  const hudStatus = document.getElementById('hud-status');
  const activeLabel = document.getElementById('instrument-active-label');
  const pauseBtn = document.getElementById('btn-pause-viz');
  const pauseText = document.getElementById('pause-btn-text');

  // Waterfall memory buffer
  const waterfallHistory = [];
  const maxWaterfallRows = 90;

  // Handle Retina resolution
  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.resetTransform?.();
    ctx.scale(dpr, dpr);
  }
  resize();
  window.addEventListener('resize', resize);

  // Tab switching
  const tabs = document.querySelectorAll('.tab-group button[data-mode]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      currentMode = tab.getAttribute('data-mode');
      updateLabels();
    });
  });

  function updateLabels() {
    if (!activeLabel || !hudTelemetry) return;
    if (currentMode === 'spectrum') {
      activeLabel.textContent = 'Real-Time Spectrum Analyzer (Welch FFT)';
      hudTelemetry.textContent = 'CF: 433.920 MHz | SPAN: 200 kHz | RBW: 976.5 Hz | SNR: 28.5 dB';
      hudStatus.textContent = 'MODE: PSD ESTIMATION';
    } else if (currentMode === 'waterfall') {
      activeLabel.textContent = '2D Time-Frequency Waterfall Cascade';
      hudTelemetry.textContent = 'TIME DEPTH: 4.8s | LINE RATE: 50 fps | DYNAMIC RANGE: 80 dB';
      hudStatus.textContent = 'MODE: SPECTROGRAM';
    } else if (currentMode === 'constellation') {
      activeLabel.textContent = 'I/Q Constellation Phase Plane (QPSK)';
      hudTelemetry.textContent = 'MODULATION: QPSK | EVM: 3.12% RMS | MER: 30.1 dB | OFFSET: 0.12°';
      hudStatus.textContent = 'MODE: SYMBOL CLUSTERS';
    } else if (currentMode === 'timedomain') {
      activeLabel.textContent = 'Quadrature Baseband Time Domain [I(t) & Q(t)]';
      hudTelemetry.textContent = 'Fs: 20.0 MSps | Vrms: 0.241 V | Crest: 3.69 | PAPR: 7.82 dB';
      hudStatus.textContent = 'MODE: QUADRATURE ENVELOPE';
    }
  }

  // Pause / Resume
  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      isRunning = !isRunning;
      if (pauseText) pauseText.textContent = isRunning ? 'Pause' : 'Resume';
      if (isRunning) loop();
    });
  }

  // IntersectionObserver to sleep when out of view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!animId && isRunning) loop();
      } else {
        if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      }
    });
  }, { threshold: 0.1 });

  observer.observe(canvas);

  // Peak hold buffer for spectrum
  const numBins = 128;
  const peakHold = new Array(numBins).fill(-120);

  // Main Render Loop
  function loop() {
    if (!isRunning) return;
    frame++;

    const w = canvas.getBoundingClientRect().width;
    const h = canvas.getBoundingClientRect().height;

    ctx.clearRect(0, 0, w, h);

    if (currentMode === 'spectrum') {
      drawSpectrum(w, h);
    } else if (currentMode === 'waterfall') {
      drawWaterfall(w, h);
    } else if (currentMode === 'constellation') {
      drawConstellation(w, h);
    } else if (currentMode === 'timedomain') {
      drawTimeDomain(w, h);
    }

    animId = requestAnimationFrame(loop);
  }

  // 1. Spectrum Analyzer Renderer
  function drawSpectrum(w, h) {
    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    // dBFS horizontal grid
    for (let db = 0; db <= 100; db += 20) {
      const y = (db / 100) * (h - 40) + 20;
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(w - 20, y);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px ui-monospace, monospace';
      ctx.fillText(`-${db} dB`, 6, y + 3);
    }

    // Frequency vertical grid
    for (let i = 0; i <= 6; i++) {
      const x = 50 + (i / 6) * (w - 70);
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, h - 20);
      ctx.stroke();
    }

    // Generate RF curve with carrier burst
    const t = frame * 0.04;
    const points = [];

    for (let i = 0; i < numBins; i++) {
      const norm = i / (numBins - 1);
      // Background noise floor (-92 dB to -88 dB)
      let val = -90 + (Math.sin(i * 1.5 + t) * 2) + ((Math.sin(i * 13 + t * 2) * 1.5));

      // Main carrier burst around bin 68
      const distFromCarrier = Math.abs(i - 68);
      if (distFromCarrier < 16) {
        const peakHeight = 70 * Math.exp(-(distFromCarrier * distFromCarrier) / 12);
        const modulationNoise = (Math.sin(t * 8 + i * 2) * 2.5);
        val += peakHeight + modulationNoise;
      }

      // Secondary sideband around bin 35
      const distFromSecondary = Math.abs(i - 35);
      if (distFromSecondary < 8) {
        val += 32 * Math.exp(-(distFromSecondary * distFromSecondary) / 8);
      }

      // Peak hold decay
      if (val > peakHold[i]) {
        peakHold[i] = val;
      } else {
        peakHold[i] -= 0.15;
      }

      const x = 50 + norm * (w - 70);
      const y = h - 20 - ((val + 100) / 100) * (h - 40);
      points.push({ x, y, val });
    }

    // Draw Peak Hold Trace
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    points.forEach((p, idx) => {
      const yPeak = h - 20 - ((peakHold[idx] + 100) / 100) * (h - 40);
      if (idx === 0) ctx.moveTo(p.x, yPeak);
      else ctx.lineTo(p.x, yPeak);
    });
    ctx.stroke();

    // Draw Main Trace Gradient Fill
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(0, 240, 255, 0.35)');
    grad.addColorStop(1, 'rgba(0, 240, 255, 0.01)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(points[0].x, h - 20);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, h - 20);
    ctx.closePath();
    ctx.fill();

    // Draw Active Trace
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    points.forEach((p, idx) => {
      if (idx === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // Draw Carrier Marker Peak
    const peakPt = points[68];
    ctx.strokeStyle = '#f59e0b';
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(peakPt.x, peakPt.y, 4, 0, Math.PI * 2);
    ctx.fill();

    // Marker label
    ctx.fillStyle = '#f8fafc';
    ctx.font = '10px ui-monospace, monospace';
    ctx.fillText('M1: +12.4 kHz [-19.2 dBFS]', peakPt.x - 45, peakPt.y - 12);
  }

  // 2. Spectrogram / Waterfall Renderer
  function drawWaterfall(w, h) {
    const rowH = (h - 20) / maxWaterfallRows;
    const t = frame * 0.05;

    // Generate new line of spectrum energy
    const row = new Uint8Array(96);
    for (let x = 0; x < 96; x++) {
      let energy = 20 + Math.random() * 15;
      const dist = Math.abs(x - 52);
      if (dist < 10) {
        // Pulsing burst transmission
        const burst = (Math.sin(t * 3) > -0.2) ? 180 : 30;
        energy = Math.min(255, energy + burst * Math.exp(-(dist * dist) / 10));
      }
      row[x] = energy;
    }

    waterfallHistory.unshift(row);
    if (waterfallHistory.length > maxWaterfallRows) {
      waterfallHistory.pop();
    }

    // Render waterfall history
    for (let y = 0; y < waterfallHistory.length; y++) {
      const dataRow = waterfallHistory[y];
      const colW = w / dataRow.length;

      for (let x = 0; x < dataRow.length; x++) {
        const val = dataRow[x];
        // Heatmap color: Navy -> Cyan -> Green -> Yellow -> Red
        let r = 4, g = 6, b = 15;
        if (val > 40 && val <= 100) {
          const f = (val - 40) / 60;
          r = Math.floor(0 * f);
          g = Math.floor(200 * f);
          b = Math.floor(255 * f);
        } else if (val > 100 && val <= 180) {
          const f = (val - 100) / 80;
          r = Math.floor(245 * f);
          g = Math.floor(220 * f);
          b = Math.floor(50 * (1 - f));
        } else if (val > 180) {
          const f = (val - 180) / 75;
          r = 255;
          g = Math.floor(80 * (1 - f));
          b = 40;
        }

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x * colW, y * rowH, colW + 0.5, rowH + 0.5);
      }
    }
  }

  // 3. I/Q Constellation Renderer (QPSK)
  function drawConstellation(w, h) {
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.38;

    // Crosshairs
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    // Horizontal In-Phase axis
    ctx.beginPath();
    ctx.moveTo(cx - radius * 1.3, cy);
    ctx.lineTo(cx + radius * 1.3, cy);
    ctx.stroke();

    // Vertical Quadrature axis
    ctx.beginPath();
    ctx.moveTo(cx, cy - radius * 1.3);
    ctx.lineTo(cx, cy + radius * 1.3);
    ctx.stroke();

    // Unit reference circle
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '11px ui-monospace, monospace';
    ctx.fillText('In-Phase (I)', cx + radius * 1.05, cy - 8);
    ctx.fillText('Quadrature (Q)', cx + 10, cy - radius * 1.15);

    // 4 QPSK Target centroids
    const centroids = [
      { i: 1, q: 1 },
      { i: -1, q: 1 },
      { i: -1, q: -1 },
      { i: 1, q: -1 }
    ];

    // EVM boundary circles
    centroids.forEach(c => {
      const px = cx + (c.i * radius * 0.707);
      const py = cy - (c.q * radius * 0.707);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
      ctx.beginPath();
      ctx.arc(px, py, radius * 0.15, 0, Math.PI * 2);
      ctx.stroke();

      // Centroid cross
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Generate noisy symbol scatter points
    ctx.fillStyle = 'rgba(0, 240, 255, 0.65)';
    const t = frame * 0.05;
    for (let s = 0; s < 120; s++) {
      const target = centroids[s % 4];
      // Gaussian-ish jitter
      const jitterI = (Math.sin(s * 7.1 + t) + Math.cos(s * 13.7)) * 0.07;
      const jitterQ = (Math.cos(s * 5.3 + t) + Math.sin(s * 11.2)) * 0.07;

      const px = cx + ((target.i * 0.707 + jitterI) * radius);
      const py = cy - ((target.q * 0.707 + jitterQ) * radius);

      ctx.beginPath();
      ctx.arc(px, py, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 4. Time Domain Quadrature Baseband [I(t) & Q(t)]
  function drawTimeDomain(w, h) {
    const cy = h / 2;
    const t = frame * 0.05;

    // Center baseline
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.stroke();

    const pointsI = [];
    const pointsQ = [];

    const amp = h * 0.28;
    for (let x = 0; x < w; x += 3) {
      const phase = (x * 0.02) - t;
      // Pulse shaping envelope
      const burstEnv = 0.6 + 0.4 * Math.sin(x * 0.005 + t * 0.5);

      // In-Phase (cos)
      const yi = cy + Math.cos(phase) * amp * burstEnv + (Math.random() - 0.5) * 3;
      // Quadrature (sin, 90 deg out of phase)
      const yq = cy + Math.sin(phase) * amp * burstEnv + (Math.random() - 0.5) * 3;

      pointsI.push({ x, y: yi });
      pointsQ.push({ x, y: yq });
    }

    // Draw In-Phase I(t)
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    pointsI.forEach((p, idx) => {
      if (idx === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // Draw Quadrature Q(t)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    pointsQ.forEach((p, idx) => {
      if (idx === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
  }

  // Kick off loop
  loop();
}
