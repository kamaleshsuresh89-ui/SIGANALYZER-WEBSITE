/**
 * SIGANALYZER Navbar Component
 * Fixed accessible navigation bar with mobile drawer and active link state.
 */

export function renderNavbar(currentPath = '#/') {
  const links = [
    { href: '#/', label: 'Home' },
    { href: '#/features', label: 'Features' },
    { href: '#/how-it-works', label: 'How It Works' },
    { href: '#/capabilities', label: 'Capabilities' },
    { href: '#/demo', label: 'Demo' },
    { href: '#/downloads', label: 'Downloads' },
    { href: '#/docs', label: 'Documentation' },
    { href: '#/faq', label: 'FAQ' },
    { href: '#/about', label: 'About' }
  ];

  const desktopLinksHtml = links.map(link => {
    const isActive = (link.href === '#/' && (currentPath === '#/' || currentPath === '#' || currentPath === '')) ||
                     (link.href !== '#/' && currentPath.startsWith(link.href));
    return `<a href="${link.href}" class="nav-link ${isActive ? 'active' : ''}">${link.label}</a>`;
  }).join('');

  const mobileLinksHtml = links.map(link => {
    const isActive = (link.href === '#/' && (currentPath === '#/' || currentPath === '#' || currentPath === '')) ||
                     (link.href !== '#/' && currentPath.startsWith(link.href));
    return `<a href="${link.href}" class="mobile-nav-link ${isActive ? 'active' : ''}">${link.label}</a>`;
  }).join('');

  return `
    <header class="site-header" id="site-header">
      <div class="container nav-container">
        <!-- Brand Logo -->
        <a href="#/" class="brand-link" aria-label="SIGANALYZER Home">
          <div class="brand-glyph">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 12h3l3-7 4 14 3-8 3 4h4" />
            </svg>
          </div>
          <span style="font-family: var(--font-mono); font-weight: 700; letter-spacing: -0.02em;">
            SIGANALYZER<span class="text-cyan">.</span>
          </span>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="nav-links" aria-label="Main Navigation" style="gap: 1.25rem;">
          ${desktopLinksHtml}
        </nav>

        <!-- Right Side Actions -->
        <div class="nav-actions">
          <a href="#/downloads" class="btn btn-primary btn-sm desktop-only">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Download</span>
          </a>

          <!-- Mobile Hamburger Toggle -->
          <button class="mobile-menu-btn" id="mobile-menu-toggle" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="mobile-drawer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="menu-icon-bars">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="menu-icon-close" style="display: none;">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Drawer -->
      <div class="mobile-drawer" id="mobile-drawer" aria-hidden="true">
        <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">
          SYSTEM NAVIGATION
        </div>
        ${mobileLinksHtml}
        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
          <a href="#/downloads" class="btn btn-primary" style="width: 100%;">Download SIGANALYZER</a>
        </div>
      </div>
    </header>
  `;
}

/**
 * Initialize navbar interaction listeners (mobile menu, escape key, auto-close)
 */
export function initNavbarListeners() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const iconBars = document.getElementById('menu-icon-bars');
  const iconClose = document.getElementById('menu-icon-close');

  if (!toggleBtn || !drawer) return;

  function setOpen(isOpen) {
    drawer.classList.toggle('open', isOpen);
    drawer.setAttribute('aria-hidden', (!isOpen).toString());
    toggleBtn.setAttribute('aria-expanded', isOpen.toString());
    if (iconBars && iconClose) {
      iconBars.style.display = isOpen ? 'none' : 'block';
      iconClose.style.display = isOpen ? 'block' : 'none';
    }
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    setOpen(!isOpen);
  });

  // Close when clicking any mobile link
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      setOpen(false);
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      setOpen(false);
      toggleBtn.focus();
    }
  });
}
