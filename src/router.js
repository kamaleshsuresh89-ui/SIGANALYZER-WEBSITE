/**
 * SIGANALYZER Client Hash Router
 * Handles all 10 views, sub-routes, parameter queries, and lifecycle event hooks.
 */

import { renderNavbar, initNavbarListeners } from './components/Navbar.js';
import { renderFooter } from './components/Footer.js';

import { renderHomePage, initHomePage } from './pages/HomePage.js';
import { renderDownloadsPage } from './pages/DownloadsPage.js';
import { renderDocsPage } from './pages/DocsPage.js';
import { renderFeaturesPage } from './pages/FeaturesPage.js';
import { renderHowItWorksPage, initHowItWorksPage } from './pages/HowItWorksPage.js';
import { renderCapabilitiesPage } from './pages/CapabilitiesPage.js';
import { renderDemoPage } from './pages/DemoPage.js';
import { renderFaqPage } from './pages/FaqPage.js';
import { renderPrivacyPage } from './pages/PrivacyPage.js';
import { renderAboutPage } from './pages/AboutPage.js';

const ROUTE_TITLES = {
  '': 'SIGANALYZER — Automated IQ & WAV Signal Intelligence',
  '/': 'SIGANALYZER — Automated IQ & WAV Signal Intelligence',
  '/features': 'Features & Capabilities — SIGANALYZER',
  '/how-it-works': '14-Stage DSP Architecture — SIGANALYZER',
  '/capabilities': 'Modulation & Signal Specifications — SIGANALYZER',
  '/demo': 'Interface Walkthrough & Demos — SIGANALYZER',
  '/downloads': 'Download Center & Release Archive — SIGANALYZER',
  '/downloads/latest': 'Latest Stable Release — SIGANALYZER',
  '/downloads/releases': 'Permanent Release Archive — SIGANALYZER',
  '/docs': 'Technical Documentation Hub — SIGANALYZER',
  '/faq': 'Technical FAQ — SIGANALYZER',
  '/privacy': 'Offline-First Privacy Policy — SIGANALYZER',
  '/about': 'About SIGANALYZER & Smart India Hackathon'
};

export function handleRoute() {
  let fullHash = window.location.hash;
  let rawPath = '/';
  let rawQuery = '';

  if (fullHash && fullHash !== '#') {
    const [hPath, hQuery] = fullHash.replace(/^#/, '').split('?');
    rawPath = hPath;
    rawQuery = hQuery || '';
  } else if (window.location.pathname && window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
    rawPath = window.location.pathname;
    rawQuery = window.location.search ? window.location.search.replace(/^\?/, '') : '';
    fullHash = '#' + rawPath + (rawQuery ? `?${rawQuery}` : '');
  } else {
    fullHash = '#/';
    rawPath = '/';
  }

  const path = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
  const queryParams = new URLSearchParams(rawQuery || '');

  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  // Render navigation shell
  const navHtml = renderNavbar(fullHash);
  const footerHtml = renderFooter();

  let pageHtml = '';
  let initHook = null;

  // Route matching
  if (path === '/' || path === '/home' || path === '') {
    pageHtml = renderHomePage();
    initHook = initHomePage;
  } else if (path.startsWith('/downloads')) {
    pageHtml = renderDownloadsPage(path);
  } else if (path.startsWith('/docs')) {
    const topic = queryParams.get('topic') || '';
    pageHtml = renderDocsPage(topic);
  } else if (path === '/features') {
    pageHtml = renderFeaturesPage();
  } else if (path === '/how-it-works') {
    pageHtml = renderHowItWorksPage();
    initHook = initHowItWorksPage;
  } else if (path === '/capabilities') {
    pageHtml = renderCapabilitiesPage();
  } else if (path === '/demo') {
    pageHtml = renderDemoPage();
  } else if (path === '/faq') {
    pageHtml = renderFaqPage();
  } else if (path === '/privacy') {
    pageHtml = renderPrivacyPage();
  } else if (path === '/about') {
    pageHtml = renderAboutPage();
  } else {
    // 404 fallback
    pageHtml = `
      <main class="container text-center" style="padding-top: calc(var(--nav-height) + 5rem); padding-bottom: 6rem;">
        <div class="card p-8 max-w-lg mx-auto" style="border: 1px solid var(--border-accent-cyan); max-width: 540px; margin: 0 auto;">
          <div class="badge badge-accent mb-4 font-mono">STATUS: 404_CARRIER_LOSS</div>
          <h1 class="hero-title mb-3" style="font-size: 2.5rem;">Signal Not Found</h1>
          <p class="text-secondary text-sm mb-6">The requested path contains no detectable modulation or route mapping.</p>
          <a href="#/" class="btn btn-primary">Return to Base Station</a>
        </div>
      </main>
    `;
  }

  // Inject into DOM
  appContainer.innerHTML = `
    ${navHtml}
    <div id="page-content">${pageHtml}</div>
    ${footerHtml}
  `;

  // Update document title
  const baseTitle = ROUTE_TITLES[path] || 'SIGANALYZER — Automated Signal Intelligence';
  document.title = baseTitle;

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Init interactive hooks
  initNavbarListeners();
  if (initHook) {
    try {
      initHook();
    } catch (err) {
      console.error('Error initializing page hook:', err);
    }
  }
}

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('popstate', handleRoute);

  // Sync route if accessed directly via pathname or empty hash
  if (!window.location.hash || window.location.hash === '#') {
    const pathname = window.location.pathname;
    if (pathname && pathname !== '/' && pathname !== '/index.html') {
      window.location.hash = '#' + pathname + (window.location.search || '');
      return;
    }
    window.location.hash = '#/';
  }
  handleRoute();
}
