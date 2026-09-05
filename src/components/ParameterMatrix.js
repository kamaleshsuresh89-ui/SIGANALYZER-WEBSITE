/**
 * SIGANALYZER ParameterMatrix Component
 * Interactive catalog of 40+ extractable parameters across 6 domains with scientific certainty markers.
 */

import { PARAMETER_CATEGORIES, CERTAINTY_LEVELS } from '../data/parameters.js';

export function renderParameterMatrix() {
  const categoryTabsHtml = PARAMETER_CATEGORIES.map((cat, idx) => `
    <button class="tab-btn param-tab-btn ${idx === 0 ? 'active' : ''}" data-cat="${cat.id}">
      ${cat.name}
    </button>
  `).join('');

  const certaintyLegendHtml = Object.values(CERTAINTY_LEVELS).map(lvl => `
    <div class="flex items-center gap-2">
      <span class="status-pill ${lvl.class}">${lvl.label}</span>
      <span style="font-size: 0.75rem; color: var(--text-muted);">${lvl.desc}</span>
    </div>
  `).join('');

  return `
    <section class="section-spacing" id="parameters-section">
      <div class="container">
        
        <div class="text-center mb-10">
          <span class="section-subtitle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            TECHNICAL PARAMETER EXTRACTION
          </span>
          <h2 class="section-title mb-3">Exhaustive Signal Characterization</h2>
          <p class="section-desc mx-auto" style="margin-left: auto; margin-right: auto;">
            SIGANALYZER extracts over 40 distinct parameters across 6 analytical domains. Every metric is qualified with an explicit scientific certainty rating.
          </p>
        </div>

        <!-- Scientific Certainty Rating Legend -->
        <div class="card p-4 mb-8" style="background: rgba(10, 14, 22, 0.6); border: 1px solid var(--border-subtle);">
          <div class="font-mono text-cyan mb-3" style="font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">
            SCIENTIFIC CERTAINTY RATING SYSTEM
          </div>
          <div class="grid grid-cols-2 md-grid-cols-3 lg-grid-cols-6 gap-3">
            ${certaintyLegendHtml}
          </div>
        </div>

        <!-- Category Selector Tabs -->
        <div class="tab-group mb-6 justify-center" id="param-tabs" role="tablist">
          ${categoryTabsHtml}
        </div>

        <!-- Parameter Table Container -->
        <div class="card card-glass p-6" style="border: 1px solid var(--border-default); overflow-x: auto;">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h3 style="font-size: 1.25rem; font-weight: 700;" id="param-cat-title">File & Capture Parameters</h3>
              <p style="font-size: 0.875rem; color: var(--text-secondary);" id="param-cat-desc">Hardware capture parameters and container serialization properties.</p>
            </div>
            <span class="badge badge-cyan" id="param-cat-count">8 PARAMETERS</span>
          </div>

          <table style="width: 100%; text-align: left; font-size: 0.875rem;">
            <thead>
              <tr style="border-bottom: 1px solid var(--border-default); color: var(--text-muted); font-family: var(--font-mono); font-size: 0.75rem;">
                <th style="padding: 0.75rem 0.5rem;">PARAMETER</th>
                <th style="padding: 0.75rem 0.5rem;">TYPE</th>
                <th style="padding: 0.75rem 0.5rem;">CERTAINTY</th>
                <th style="padding: 0.75rem 0.5rem;">EXAMPLE EXTRACTION</th>
              </tr>
            </thead>
            <tbody id="param-table-body">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>

      </div>
    </section>
  `;
}

export function initParameterMatrixListeners() {
  const tabs = document.querySelectorAll('.param-tab-btn');
  const tableBody = document.getElementById('param-table-body');
  const titleEl = document.getElementById('param-cat-title');
  const descEl = document.getElementById('param-cat-desc');
  const countEl = document.getElementById('param-cat-count');

  if (!tabs.length || !tableBody) return;

  function renderCategory(catId) {
    const category = PARAMETER_CATEGORIES.find(c => c.id === catId);
    if (!category) return;

    if (titleEl) titleEl.textContent = `${category.name} Parameters`;
    if (descEl) descEl.textContent = category.description;
    if (countEl) countEl.textContent = `${category.parameters.length} PARAMETERS`;

    tableBody.innerHTML = category.parameters.map(p => `
      <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
        <td style="padding: 0.85rem 0.5rem; font-weight: 600; color: #f8fafc;">
          ${p.name}
        </td>
        <td style="padding: 0.85rem 0.5rem; color: var(--text-secondary); font-family: var(--font-mono); font-size: 0.8rem;">
          ${p.type}
        </td>
        <td style="padding: 0.85rem 0.5rem;">
          <span class="status-pill ${p.certainty.class}">${p.certainty.label}</span>
        </td>
        <td style="padding: 0.85rem 0.5rem; font-family: var(--font-mono); color: var(--accent-cyan); font-size: 0.82rem;">
          ${p.example}
        </td>
      </tr>
    `).join('');
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderCategory(tab.getAttribute('data-cat'));
    });
  });

  // Initial render
  renderCategory('file-capture');
}
