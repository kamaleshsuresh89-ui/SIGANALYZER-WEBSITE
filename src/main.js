/**
 * SIGANALYZER Main Entrypoint
 * Bootstraps the application, registers error boundaries, starts router,
 * and handles background GitHub release synchronization.
 */

import { initRouter, handleRoute } from './router.js';
import { fetchLiveReleases } from './data/releases.js';

document.addEventListener('DOMContentLoaded', () => {
  try {
    initRouter();

    // Listen for dynamic release updates from GitHub API
    window.addEventListener('releases:updated', () => {
      const hash = window.location.hash || '';
      // Only trigger re-render if current view consumes release data (downloads or home)
      if (hash.startsWith('#/downloads') || hash === '#/' || hash === '' || hash === '#/home') {
        handleRoute();
      }
    });

    // Fetch live releases in background (non-blocking, cached in sessionStorage)
    fetchLiveReleases().catch(err => {
      console.debug('Background GitHub release sync note:', err.message);
    });

  } catch (err) {
    console.error('Failed to initialize SIGANALYZER application:', err);
  }
});
