/**
 * SIGANALYZER Centralized Release & Version Management Data Architecture
 * 
 * Production-ready release system backed by GitHub Releases:
 * Target Repository: kamaleshsuresh89-ui/SIGANALYZER
 * 
 * IMPORTANT PRODUCT RULES:
 * - SIGANALYZER is a DESKTOP APPLICATION ONLY (Windows, macOS, Linux).
 * - There is NO Android app and NO iOS app.
 * - Single Source of Truth: GitHub Releases (with pre-bundled offline snapshot).
 * - Permanent Archives: Older versions remain permanently accessible.
 * - Never fabricates fake checksums or download URLs.
 */

import { RELEASES_SNAPSHOT } from './releases-snapshot.js';

export const REPOSITORY = 'kamaleshsuresh89-ui/SIGANALYZER';

export const RELEASE_CHANNELS = {
  STABLE: 'stable',
  BETA: 'beta',
  NIGHTLY: 'nightly'
};

export const RELEASE_STATUS = {
  AVAILABLE: 'available',
  COMING_SOON: 'coming-soon',
  DEPRECATED: 'deprecated'
};

/**
 * Supported Desktop Platforms ONLY.
 * Mobile platforms (Android/iOS) are strictly excluded.
 */
export const PLATFORMS = {
  WINDOWS: {
    id: 'windows',
    name: 'Windows',
    tagline: 'Windows 10 / 11 (64-bit)',
    supportedArchs: ['x64', 'ARM64'],
    expectedFormats: ['.exe', '.msi', '.zip'],
    minOs: 'Windows 10 (Build 1809+) or Windows 11'
  },
  MACOS: {
    id: 'macos',
    name: 'macOS',
    tagline: 'macOS Monterey (12.0) or later',
    supportedArchs: ['Apple Silicon (arm64)', 'Intel (x86_64)'],
    expectedFormats: ['.dmg', '.zip'],
    minOs: 'macOS 12.0 (Monterey) or later'
  },
  LINUX: {
    id: 'linux',
    name: 'Linux',
    tagline: 'Modern Linux Distributions (x86_64 / ARM64)',
    supportedArchs: ['x64 (x86_64)', 'ARM64 (aarch64)'],
    expectedFormats: ['.AppImage', '.deb', '.tar.gz'],
    minOs: 'glibc 2.31+ (Ubuntu 20.04+, Debian 11+, Fedora 34+, Arch)'
  }
};

/**
 * Format bytes into human-readable string (e.g. "84.2 MB")
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Parse desktop platform from asset filename
 * STRICTLY Windows, macOS, Linux only.
 */
export function parsePlatform(fileName) {
  const name = (fileName || '').toLowerCase();

  // Strictly exclude mobile files
  if (name.includes('android') || name.includes('.apk') || name.includes('.ipa') || name.includes('ios')) {
    return null;
  }

  if (name.includes('win') || name.endsWith('.exe') || name.endsWith('.msi')) {
    return 'windows';
  }
  if (name.includes('mac') || name.includes('darwin') || name.endsWith('.dmg') || name.endsWith('.pkg') || name.includes('osx')) {
    return 'macos';
  }
  if (name.includes('linux') || name.endsWith('.appimage') || name.endsWith('.deb') || name.endsWith('.tar.gz') || name.endsWith('.tar.xz') || name.endsWith('.rpm')) {
    return 'linux';
  }

  return null;
}

/**
 * Infer CPU architecture from filename
 */
export function parseArchitecture(fileName, platform) {
  const name = (fileName || '').toLowerCase();

  if (platform === 'macos') {
    if (name.includes('arm64') || name.includes('m1') || name.includes('m2') || name.includes('apple-silicon')) {
      return 'Apple Silicon (arm64)';
    }
    if (name.includes('intel') || name.includes('x86_64') || name.includes('x64')) {
      return 'Intel (x86_64)';
    }
    return 'Universal (Apple Silicon & Intel)';
  }

  if (platform === 'windows') {
    if (name.includes('arm64') || name.includes('aarch64')) {
      return 'ARM64';
    }
    if (name.includes('x64') || name.includes('win64') || name.includes('x86_64') || name.includes('64bit')) {
      return 'x64';
    }
    return 'x64';
  }

  if (platform === 'linux') {
    if (name.includes('arm64') || name.includes('aarch64')) {
      return 'ARM64 (aarch64)';
    }
    if (name.includes('x86_64') || name.includes('amd64') || name.includes('x64')) {
      return 'x64 (x86_64)';
    }
    return 'x64';
  }

  return 'Architecture information unavailable';
}

/**
 * Extract SHA-256 checksums from release notes markdown
 */
export function extractChecksumsFromBody(body, assetNames) {
  const checksumMap = {};
  if (!body) return checksumMap;

  const hashRegex = /\b([a-fA-F0-9]{64})\b/g;
  const lines = body.split('\n');

  for (const line of lines) {
    for (const name of assetNames) {
      if (line.includes(name)) {
        const matches = line.match(hashRegex);
        if (matches && matches[0]) {
          checksumMap[name] = matches[0].toLowerCase();
        }
      }
    }
  }

  return checksumMap;
}

/**
 * Transform a raw GitHub Release API object into the SIGANALYZER Release model
 */
export function transformGitHubRelease(ghRelease) {
  const tag = ghRelease.tag_name || '';
  const version = tag.replace(/^v/i, '').trim();
  const isPrerelease = Boolean(ghRelease.prerelease);
  const nameLower = ((ghRelease.name || '') + tag).toLowerCase();

  let channel = RELEASE_CHANNELS.STABLE;
  if (isPrerelease) {
    channel = RELEASE_CHANNELS.BETA;
  }
  if (nameLower.includes('nightly') || nameLower.includes('dev')) {
    channel = RELEASE_CHANNELS.NIGHTLY;
  }

  const releaseDate = (ghRelease.published_at || ghRelease.created_at || new Date().toISOString()).split('T')[0];

  const rawAssets = ghRelease.assets || [];
  const appAssets = [];

  for (const asset of rawAssets) {
    const plat = parsePlatform(asset.name);
    if (plat) {
      appAssets.push(asset);
    }
  }

  const bodyChecksums = extractChecksumsFromBody(
    ghRelease.body || '',
    appAssets.map(a => a.name)
  );

  const artifacts = appAssets.map(asset => {
    const platform = parsePlatform(asset.name);
    const architecture = parseArchitecture(asset.name, platform);
    const ext = asset.name.includes('.') ? `.${asset.name.split('.').pop()}` : '';
    const format = ext ? `${ext} package` : 'Binary package';
    const checksum = bodyChecksums[asset.name] || null;

    return {
      platform,
      architecture,
      format,
      fileName: asset.name,
      fileSize: formatBytes(asset.size),
      downloadUrl: asset.browser_download_url,
      checksum,
      checksumAlgorithm: 'SHA-256',
      available: true
    };
  });

  const status = artifacts.length > 0 ? RELEASE_STATUS.AVAILABLE : RELEASE_STATUS.COMING_SOON;

  const supportedPlatforms = Array.from(new Set(artifacts.map(a => a.platform)));
  if (supportedPlatforms.length === 0) {
    supportedPlatforms.push('windows', 'macos', 'linux');
  }

  const whatsNew = [];
  if (ghRelease.body) {
    const lines = ghRelease.body.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if ((trimmed.startsWith('- ') || trimmed.startsWith('* ')) && trimmed.length > 4) {
        whatsNew.push(trimmed.substring(2).trim());
      }
    }
  }

  return {
    version,
    tag,
    title: ghRelease.name || `SIGANALYZER v${version}`,
    releaseDate,
    channel,
    status,
    description: ghRelease.body ? ghRelease.body.split('\n')[0].replace(/^[#*\s-]+/, '').trim() : `SIGANALYZER ${version} release.`,
    whatsNew: whatsNew.length > 0 ? whatsNew.slice(0, 8) : [
      'Automated IQ & WAV signal analysis engine update.',
      'Performance enhancements and stability improvements.'
    ],
    releaseNotes: ghRelease.body || `Official release notes for SIGANALYZER v${version}.`,
    htmlUrl: ghRelease.html_url || `https://github.com/${REPOSITORY}/releases/tag/${tag}`,
    supportedPlatforms,
    artifacts,
    knownIssues: []
  };
}

/**
 * Abstract Release Provider Interface
 */
export class ReleaseProvider {
  async getReleases() {
    throw new Error('Not implemented');
  }
  async getLatestStable() {
    throw new Error('Not implemented');
  }
  async getRelease(version) {
    throw new Error('Not implemented');
  }
}

/**
 * Local Release Provider
 * Backed by bundled pre-synced release snapshot. Guaranteed instant and offline-ready.
 */
export class LocalReleaseProvider extends ReleaseProvider {
  constructor(releases = RELEASES_SNAPSHOT) {
    super();
    this.setReleases(releases);
  }

  setReleases(releases) {
    this.releases = [...releases].sort((a, b) => {
      return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
    });
  }

  getAllReleasesSync() {
    return [...this.releases];
  }

  async getReleases() {
    return this.getAllReleasesSync();
  }

  getLatestStableReleaseSync() {
    const stable = this.releases.filter(
      r => r.channel === RELEASE_CHANNELS.STABLE && r.status !== RELEASE_STATUS.DEPRECATED
    );
    return stable[0] || this.releases[0];
  }

  async getLatestStable() {
    return this.getLatestStableReleaseSync();
  }

  getReleaseByVersionSync(rawVersion) {
    if (!rawVersion) return null;
    const clean = rawVersion.replace(/^v/i, '').trim();
    return this.releases.find(r => r.version.replace(/^v/i, '') === clean) || null;
  }

  async getRelease(version) {
    return this.getReleaseByVersionSync(version);
  }

  getReleasesByChannelSync(channel) {
    return this.releases.filter(r => r.channel === channel);
  }
}

/**
 * GitHub Release Provider
 * Dynamically queries public GitHub Releases API:
 * https://api.github.com/repos/kamaleshsuresh89-ui/SIGANALYZER/releases
 * 
 * Features:
 * - Caches responses in browser sessionStorage (10-minute TTL) to respect rate limits.
 * - Falls back seamlessly to LocalReleaseProvider if offline or rate-limited.
 * - Dispatches 'releases:updated' event on window when live releases are fetched.
 */
export class GitHubReleaseProvider extends ReleaseProvider {
  constructor(repo = REPOSITORY, fallbackProvider = new LocalReleaseProvider()) {
    super();
    this.repo = repo;
    this.fallbackProvider = fallbackProvider;
    this.cacheKey = `siganalyzer_gh_releases_${repo.replace('/', '_')}`;
    this.cacheTtlMs = 10 * 60 * 1000; // 10 minutes
    this.activeReleases = this.fallbackProvider.getAllReleasesSync();

    // Check cached data from sessionStorage if available
    this.loadFromCache();
  }

  loadFromCache() {
    if (typeof window === 'undefined' || !window.sessionStorage) return;
    try {
      const cached = window.sessionStorage.getItem(this.cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.timestamp && (Date.now() - parsed.timestamp < this.cacheTtlMs) && Array.isArray(parsed.data)) {
          this.activeReleases = parsed.data;
          this.fallbackProvider.setReleases(this.activeReleases);
        }
      }
    } catch {
      // Ignore cache read errors
    }
  }

  saveToCache(data) {
    if (typeof window === 'undefined' || !window.sessionStorage) return;
    try {
      window.sessionStorage.setItem(this.cacheKey, JSON.stringify({
        timestamp: Date.now(),
        data
      }));
    } catch {
      // Ignore cache quota errors
    }
  }

  getAllReleasesSync() {
    return [...this.activeReleases];
  }

  getLatestStableReleaseSync() {
    const stable = this.activeReleases.filter(
      r => r.channel === RELEASE_CHANNELS.STABLE && r.status !== RELEASE_STATUS.DEPRECATED
    );
    return stable[0] || this.activeReleases[0];
  }

  getReleaseByVersionSync(rawVersion) {
    if (!rawVersion) return null;
    const clean = rawVersion.replace(/^v/i, '').trim();
    return this.activeReleases.find(r => r.version.replace(/^v/i, '') === clean) || null;
  }

  getReleasesByChannelSync(channel) {
    return this.activeReleases.filter(r => r.channel === channel);
  }

  /**
   * Fetch live releases from GitHub API
   */
  async fetchLive() {
    if (typeof window === 'undefined' || !window.fetch) {
      return this.activeReleases;
    }

    try {
      const apiUrl = `https://api.github.com/repos/${this.repo}/releases?per_page=50`;
      const res = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!res.ok) {
        // Rate limited or repo 404: use fallback
        return this.activeReleases;
      }

      const ghReleases = await res.json();
      if (!Array.isArray(ghReleases) || ghReleases.length === 0) {
        return this.activeReleases;
      }

      const publicReleases = ghReleases.filter(r => !r.draft);
      if (publicReleases.length === 0) {
        return this.activeReleases;
      }

      const transformed = publicReleases.map(transformGitHubRelease);
      transformed.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());

      this.activeReleases = transformed;
      this.fallbackProvider.setReleases(transformed);
      this.saveToCache(transformed);

      // Dispatch event for UI reactivity
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('releases:updated', { detail: transformed }));
      }

      return transformed;
    } catch {
      // Network error or offline: gracefully return cached/fallback releases
      return this.activeReleases;
    }
  }

  async getReleases() {
    return this.getAllReleasesSync();
  }

  async getLatestStable() {
    return this.getLatestStableReleaseSync();
  }

  async getRelease(version) {
    return this.getReleaseByVersionSync(version);
  }
}

// Global active release provider instance
export const localProvider = new LocalReleaseProvider(RELEASES_SNAPSHOT);
export const defaultReleaseProvider = new GitHubReleaseProvider(REPOSITORY, localProvider);

/**
 * Synchronous helper: get the latest stable release
 */
export function getLatestStableRelease() {
  return defaultReleaseProvider.getLatestStableReleaseSync();
}

/**
 * Synchronous helper: get all releases sorted newest to oldest
 */
export function getAllReleases() {
  return defaultReleaseProvider.getAllReleasesSync();
}

/**
 * Synchronous helper: get release by version string (supports '0.9.0' or 'v0.9.0')
 */
export function getReleaseByVersion(version) {
  return defaultReleaseProvider.getReleaseByVersionSync(version);
}

/**
 * Synchronous helper: get releases by channel ('stable', 'beta', 'nightly')
 */
export function getReleasesByChannel(channel) {
  return defaultReleaseProvider.getReleasesByChannelSync(channel);
}

/**
 * Asynchronous background fetch helper to query GitHub Releases API in browser
 */
export function fetchLiveReleases() {
  return defaultReleaseProvider.fetchLive();
}

/**
 * Detect client desktop operating system from browser navigator.
 * ONLY detects Windows, macOS, or Linux.
 * Mobile operating systems (Android/iOS) are strictly excluded and will return null
 * so all desktop platforms are shown.
 */
export function detectUserDesktopPlatform() {
  if (typeof window === 'undefined' || !window.navigator) {
    return null;
  }
  const ua = window.navigator.userAgent.toLowerCase();
  const platform = window.navigator.platform?.toLowerCase() || '';

  // Exclude mobile devices entirely from desktop detection
  if (ua.includes('android') || ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
    return null;
  }

  if (ua.includes('mac') || platform.includes('mac')) {
    return PLATFORMS.MACOS;
  }
  if (ua.includes('win') || platform.includes('win')) {
    return PLATFORMS.WINDOWS;
  }
  if (ua.includes('linux') || platform.includes('linux')) {
    return PLATFORMS.LINUX;
  }
  return null;
}
