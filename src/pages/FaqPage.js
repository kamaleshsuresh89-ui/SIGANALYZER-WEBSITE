/**
 * SIGANALYZER FaqPage
 * Standalone dedicated FAQ page.
 */

import { renderFaqAccordion } from '../components/FaqAccordion.js';

export function renderFaqPage() {
  return `
    <main class="container" style="padding-top: calc(var(--nav-height) + 2.5rem); padding-bottom: 5rem;">
      ${renderFaqAccordion()}
    </main>
  `;
}
