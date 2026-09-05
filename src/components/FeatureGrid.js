/**
 * SIGANALYZER FeatureGrid Component
 * Categorized capability matrix with transparent development statuses.
 */

import { FEATURE_CATEGORIES } from '../data/features.js';

export function renderFeatureGrid() {
  const categoriesHtml = FEATURE_CATEGORIES.map(cat => {
    const featuresListHtml = cat.features.map(f => `
      <div class="card card-interactive p-5">
        <div class="flex items-center justify-between mb-3">
          <span class="badge ${f.status.class}">${f.status.label}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--border-default)" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h4 style="font-size: 1.05rem; font-weight: 600; margin-bottom: 0.5rem; letter-spacing: -0.01em;">${f.name}</h4>
        <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.55;">${f.description}</p>
      </div>
    `).join('');

    return `
      <div class="mb-12">
        <div class="mb-4">
          <h3 style="font-size: 1.35rem; font-weight: 700; margin-bottom: 0.35rem;">${cat.title}</h3>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">${cat.description}</p>
        </div>
        <div class="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-4 gap-4">
          ${featuresListHtml}
        </div>
      </div>
    `;
  }).join('');

  return `
    <section class="section-spacing" id="features-section">
      <div class="container">
        
        <div class="text-center mb-12">
          <span class="section-subtitle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 2 7 12 12 22 7 12 2"/></svg>
            PLATFORM CAPABILITIES
          </span>
          <h2 class="section-title mb-3">Engineering Capabilities Matrix</h2>
          <p class="section-desc mx-auto" style="margin-left: auto; margin-right: auto;">
            Rigorous automated DSP and protocol investigation algorithms. Every capability is transparently classified as Core Engine, Implemented, or Planned.
          </p>
        </div>

        <div>
          ${categoriesHtml}
        </div>

      </div>
    </section>
  `;
}
