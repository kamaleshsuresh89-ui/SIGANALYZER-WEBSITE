/**
 * SIGANALYZER PipelineVisual Component
 * 14-stage interactive DSP pipeline visualization with step selector.
 */

import { PIPELINE_STAGES } from '../data/pipeline.js';

export function renderPipelineVisual() {
  const stepsGridHtml = PIPELINE_STAGES.map((stage, idx) => `
    <button class="card card-interactive text-left p-4 pipeline-step-card ${idx === 0 ? 'active' : ''}" data-step="${stage.step}" style="cursor: pointer; border-radius: var(--radius-md);">
      <div class="flex items-center justify-between mb-2">
        <span class="font-mono text-cyan" style="font-size: 0.72rem; font-weight: 700;">STAGE ${String(stage.step).padStart(2, '0')}</span>
        <span class="badge badge-outline" style="font-size: 0.65rem;">${stage.category}</span>
      </div>
      <div style="font-weight: 600; font-size: 0.92rem; margin-bottom: 0.25rem;">${stage.title}</div>
      <div style="font-size: 0.78rem; color: var(--text-secondary); line-height: 1.4;">${stage.shortDesc}</div>
    </button>
  `).join('');

  return `
    <section class="section-spacing" id="pipeline-section" style="background: rgba(11, 15, 23, 0.4);">
      <div class="container">
        
        <div class="text-center mb-12">
          <span class="section-subtitle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            HOW IT WORKS
          </span>
          <h2 class="section-title mb-3">14-Stage Signal Processing Pipeline</h2>
          <p class="section-desc mx-auto" style="margin-left: auto; margin-right: auto;">
            Explore the multi-layer mathematical architecture executing inside the SIGANALYZER processing core. Click any stage to inspect the DSP method.
          </p>
        </div>

        <!-- 14 Stages Grid -->
        <div class="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-4 gap-3 mb-8" id="pipeline-steps-container" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));">
          ${stepsGridHtml}
        </div>

        <!-- Inspector Detail Box -->
        <div class="card card-telemetry" id="pipeline-inspector-box">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="pulse-dot"></span>
              <span class="font-mono text-cyan" style="font-size: 0.85rem; font-weight: 700;" id="inspect-title">STAGE 01 — FILE INPUT</span>
            </div>
            <span class="badge badge-cyan" id="inspect-cat">INGEST</span>
          </div>
          <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; font-family: var(--font-sans);" id="inspect-detail">
            Streams binary signal buffers from local storage into zero-copy memory buffers without network transmission.
          </p>
        </div>

      </div>
    </section>
  `;
}

export function initPipelineListeners() {
  const cards = document.querySelectorAll('.pipeline-step-card');
  const titleEl = document.getElementById('inspect-title');
  const catEl = document.getElementById('inspect-cat');
  const detailEl = document.getElementById('inspect-detail');

  if (!cards.length || !titleEl) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.style.borderColor = 'var(--border-subtle)');
      card.style.borderColor = 'var(--accent-cyan)';

      const stepNum = parseInt(card.getAttribute('data-step'), 10);
      const stage = PIPELINE_STAGES.find(s => s.step === stepNum);
      if (stage) {
        titleEl.textContent = `STAGE ${String(stage.step).padStart(2, '0')} — ${stage.title.toUpperCase()}`;
        catEl.textContent = stage.category.toUpperCase();
        detailEl.textContent = stage.detail;
      }
    });
  });
}
