/**
 * SIGANALYZER HowItWorksPage
 * Standalone dedicated page for 14-stage DSP flow.
 */

import { renderPipelineVisual, initPipelineListeners } from '../components/PipelineVisual.js';

export function renderHowItWorksPage() {
  return `
    <main class="container" style="padding-top: calc(var(--nav-height) + 2.5rem); padding-bottom: 5rem;">
      <div class="text-center mb-8">
        <div class="badge badge-cyan mb-3">SYSTEM ARCHITECTURE</div>
        <h1 class="hero-title mb-3" style="font-size: clamp(2.2rem, 5vw, 3.5rem);">
          How SIGANALYZER Operates
        </h1>
        <p class="section-desc mx-auto" style="margin-left: auto; margin-right: auto;">
          From the moment a binary IQ or audio WAV file is loaded into memory, SIGANALYZER executes a multi-phase DSP sequence leading to decoded packets and verifiable reports.
        </p>
      </div>

      ${renderPipelineVisual()}
    </main>
  `;
}

export function initHowItWorksPage() {
  initPipelineListeners();
}
