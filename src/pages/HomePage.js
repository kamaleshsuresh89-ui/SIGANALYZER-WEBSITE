/**
 * SIGANALYZER HomePage
 * Assembles Phase 1 core landing experience.
 */

import { renderHero } from '../components/Hero.js';
import { renderSignalVisualizer, initSignalVisualizer } from '../components/SignalVisualizer.js';
import { renderValueFlow } from '../components/ValueFlow.js';
import { renderPipelineVisual, initPipelineListeners } from '../components/PipelineVisual.js';
import { renderFeatureGrid } from '../components/FeatureGrid.js';
import { renderOfflineFirst } from '../components/OfflineFirst.js';
import { renderParameterMatrix, initParameterMatrixListeners } from '../components/ParameterMatrix.js';
import { renderExplainabilityCard, initExplainabilityListeners } from '../components/ExplainabilityCard.js';
import { renderDownloadCta } from '../components/DownloadCta.js';
import { renderFaqAccordion } from '../components/FaqAccordion.js';

export function renderHomePage() {
  return `
    <main id="home-page">
      ${renderHero()}
      ${renderSignalVisualizer()}
      ${renderValueFlow()}
      ${renderPipelineVisual()}
      ${renderFeatureGrid()}
      ${renderOfflineFirst()}
      ${renderParameterMatrix()}
      ${renderExplainabilityCard()}
      ${renderDownloadCta()}
      ${renderFaqAccordion()}
    </main>
  `;
}

export function initHomePage() {
  initSignalVisualizer();
  initPipelineListeners();
  initParameterMatrixListeners();
  initExplainabilityListeners();
}
