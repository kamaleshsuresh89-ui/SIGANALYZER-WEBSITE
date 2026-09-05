/**
 * SIGANALYZER FeaturesPage
 * Standalone dedicated page for full feature matrix.
 */

import { renderFeatureGrid } from '../components/FeatureGrid.js';

export function renderFeaturesPage() {
  return `
    <main class="container" style="padding-top: calc(var(--nav-height) + 2.5rem); padding-bottom: 5rem;">
      <div class="text-center mb-8">
        <div class="badge badge-cyan mb-3">TECHNICAL SPECIFICATION</div>
        <h1 class="hero-title mb-3" style="font-size: clamp(2.2rem, 5vw, 3.5rem);">
          Complete Feature Matrix
        </h1>
        <p class="section-desc mx-auto" style="margin-left: auto; margin-right: auto;">
          Full architectural audit of SIGANALYZER capabilities across signal ingest, spectral mathematics, modulation recognition, and protocol discovery.
        </p>
      </div>

      ${renderFeatureGrid()}
    </main>
  `;
}
