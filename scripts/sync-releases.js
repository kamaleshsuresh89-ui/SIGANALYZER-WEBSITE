#!/usr/bin/env node
/**
 * SIGANALYZER GitHub Release Synchronization Script
 * 
 * Fetches releases from GitHub Releases API (kamaleshsuresh89-ui/SIGANALYZER),
 * parses desktop application artifacts (Windows, macOS, Linux),
 * extracts architectures, file sizes, and genuine SHA-256 checksums,
 * and updates src/data/releases.json and src/data/releases-snapshot.js.
 * 
 * Strict Product Constraints:
 * - Desktop application platforms ONLY (Windows, macOS, Linux).
 * - Strictly rejects mobile artifacts (Android, iOS, APK, IPA).
 * - Strictly rejects source archives, debug symbols, documentation, test artifacts.
 * - Genuine SHA-256 values ONLY (exactly 64 hex characters).
 * - Never fabricates fake checksums, download URLs, or versions.
 * - Never overwrites existing release data with an empty dataset on API failure.
 * - Per-release error isolation: skips malformed releases and continues processing.
 */

import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_FILE = path.join(ROOT_DIR, 'src', 'data', 'releases.json');
const OUTPUT_JS = path.join(ROOT_DIR, 'src', 'data', 'releases-snapshot.js');

// Configuration from environment or defaults
// If running inside GitHub Actions on the website repo, GITHUB_REPOSITORY defaults to the website repo.
// We guarantee it targets the software repository kamaleshsuresh89-ui/SIGANALYZER.
const REPO = process.env.SOFTWARE_REPOSITORY || process.env.SIGANALYZER_REPO ||
  (process.env.GITHUB_REPOSITORY && process.env.GITHUB_REPOSITORY !== 'kamaleshsuresh89-ui/SIGANALYZER-WEBSITE'
    ? process.env.GITHUB_REPOSITORY
    : 'kamaleshsuresh89-ui/SIGANALYZER');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';

console.log(`[sync-releases] Target Repository: ${REPO}`);
console.log(`[sync-releases] Output JSON: ${OUTPUT_FILE}`);
console.log(`[sync-releases] Output JS:   ${OUTPUT_JS}`);

/**
 * Validates a genuine SHA-256 hexadecimal hash string (exactly 64 hex chars)
 */
function isValidSha256(str) {
  return typeof str === 'string' && /^[a-fA-F0-9]{64}$/.test(str.trim());
}

/**
 * Make an HTTPS GET request returning parsed JSON
 */
function fetchJson(url, headers = {}, useAuth = true) {
  return new Promise((resolve, reject) => {
    const defaultHeaders = {
      'User-Agent': 'SIGANALYZER-Release-Sync/1.0',
      'Accept': 'application/vnd.github.v3+json',
      ...headers
    };

    if (useAuth && GITHUB_TOKEN) {
      defaultHeaders['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    https.get(url, { headers: defaultHeaders }, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchJson(res.headers.location, headers, useAuth));
      }

      let rawData = '';
      res.on('data', chunk => { rawData += chunk; });
      res.on('end', () => {
        // If authenticated request is rejected (e.g. repo-scoped token on cross-repo query), retry unauthenticated
        if (useAuth && GITHUB_TOKEN && (res.statusCode === 401 || res.statusCode === 403)) {
          console.warn(`[sync-releases] Authenticated request returned HTTP ${res.statusCode}. Falling back to unauthenticated public request...`);
          return resolve(fetchJson(url, headers, false));
        }

        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve({ ok: true, data: JSON.parse(rawData) });
          } catch (e) {
            reject(new Error(`Failed to parse JSON response: ${e.message}`));
          }
        } else {
          resolve({ ok: false, status: res.statusCode, message: rawData });
        }
      });
    }).on('error', err => {
      reject(err);
    });
  });
}

/**
 * Make an HTTPS GET request returning raw text (for checksum files)
 */
function fetchText(url, headers = {}, useAuth = true) {
  return new Promise((resolve, reject) => {
    const defaultHeaders = {
      'User-Agent': 'SIGANALYZER-Release-Sync/1.0',
      ...headers
    };

    if (useAuth && GITHUB_TOKEN) {
      defaultHeaders['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    https.get(url, { headers: defaultHeaders }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchText(res.headers.location, headers, useAuth));
      }

      let rawData = '';
      res.on('data', chunk => { rawData += chunk; });
      res.on('end', () => {
        // If authenticated request is rejected, retry unauthenticated
        if (useAuth && GITHUB_TOKEN && (res.statusCode === 401 || res.statusCode === 403)) {
          console.warn(`[sync-releases] Authenticated asset request returned HTTP ${res.statusCode}. Falling back to unauthenticated public request...`);
          return resolve(fetchText(url, headers, false));
        }

        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ ok: true, text: rawData });
        } else {
          resolve({ ok: false, status: res.statusCode, text: '' });
        }
      });
    }).on('error', err => {
      reject(err);
    });
  });
}

/**
 * Format bytes into human-readable string (e.g. "84.2 MB")
 */
function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Check if a file is a checksum / metadata asset rather than application binary
 */
function isChecksumAsset(fileName) {
  const name = (fileName || '').toLowerCase();
  return name.endsWith('.sha256') ||
         name.endsWith('.sha256sum') ||
         name.includes('sha256sums') ||
         name.includes('checksum') ||
         name.endsWith('.sig');
}

/**
 * Parse desktop platform from asset filename
 * STRICTLY Windows, macOS, Linux only.
 */
function parsePlatform(fileName) {
  const name = (fileName || '').toLowerCase();

  // 1. Explicitly reject mobile files
  if (name.includes('android') || name.includes('.apk') || name.includes('.ipa') || name.includes('ios')) {
    return null;
  }

  // 2. Explicitly reject checksum files, debug symbols, documentation, source archives, test artifacts
  if (
    isChecksumAsset(name) ||
    name.includes('source') ||
    name.endsWith('.src.tar.gz') ||
    name.endsWith('.src.zip') ||
    name.includes('symbols') ||
    name.endsWith('.pdb') ||
    name.endsWith('.dsym') ||
    name.endsWith('.dbg') ||
    name.endsWith('.pdf') ||
    name.endsWith('.md') ||
    name.endsWith('.txt') ||
    name.includes('test') ||
    name.includes('mock') ||
    name.includes('fixture')
  ) {
    return null;
  }

  // 3. Match supported desktop formats ONLY
  // Windows: .exe, .msi
  if (name.endsWith('.exe') || name.endsWith('.msi')) {
    return 'windows';
  }

  // macOS: .dmg, .pkg
  if (name.endsWith('.dmg') || name.endsWith('.pkg')) {
    return 'macos';
  }

  // Linux: .appimage, .deb, .rpm, .tar.gz, .tar.xz
  if (
    name.endsWith('.appimage') ||
    name.endsWith('.deb') ||
    name.endsWith('.rpm') ||
    name.endsWith('.tar.gz') ||
    name.endsWith('.tar.xz')
  ) {
    return 'linux';
  }

  return null;
}

/**
 * Infer CPU architecture from filename
 */
function parseArchitecture(fileName, platform) {
  const name = (fileName || '').toLowerCase();

  if (platform === 'macos') {
    if (name.includes('arm64') || name.includes('m1') || name.includes('m2') || name.includes('m3') || name.includes('apple-silicon')) {
      return 'arm64 / Apple Silicon';
    }
    if (name.includes('intel') || name.includes('x86_64') || name.includes('x64')) {
      return 'x86_64 / Intel';
    }
    return 'Universal';
  }

  if (platform === 'windows') {
    if (name.includes('arm64') || name.includes('aarch64')) {
      return 'arm64';
    }
    if (name.includes('x64') || name.includes('win64') || name.includes('x86_64') || name.includes('64bit') || name.includes('amd64')) {
      return 'x64';
    }
    return 'x64';
  }

  if (platform === 'linux') {
    if (name.includes('arm64') || name.includes('aarch64')) {
      return 'arm64 / aarch64';
    }
    if (name.includes('x86_64') || name.includes('amd64') || name.includes('x64')) {
      return 'x86_64 / x64';
    }
    return 'x86_64 / x64';
  }

  return 'Architecture information unavailable';
}

/**
 * Extract SHA-256 checksums from text (e.g. SHA256SUMS.txt or markdown body)
 */
function extractChecksumsFromText(text, assetNames) {
  const checksumMap = {};
  if (!text) return checksumMap;

  const lines = text.split('\n');
  const hashRegex = /\b([a-fA-F0-9]{64})\b/;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    for (const name of assetNames) {
      if (trimmed.includes(name)) {
        const match = trimmed.match(hashRegex);
        if (match && isValidSha256(match[1])) {
          checksumMap[name] = match[1].toLowerCase();
        }
      }
    }
  }

  return checksumMap;
}

/**
 * Transform a GitHub Release API object into the SIGANALYZER Release model
 */
async function transformGitHubRelease(ghRelease) {
  const tag = (ghRelease.tag_name || '').trim();
  const version = tag.replace(/^v/i, '').trim();
  const isPrerelease = Boolean(ghRelease.prerelease);
  const title = ghRelease.name || `SIGANALYZER v${version}`;
  const nameLower = (title + ' ' + tag).toLowerCase();

  // Channel classification
  let channel = 'stable';
  if (isPrerelease || nameLower.includes('-beta') || nameLower.includes('beta') || nameLower.includes('-rc') || nameLower.includes('rc.')) {
    channel = 'beta';
  }
  if (nameLower.includes('nightly') || nameLower.includes('dev')) {
    channel = 'nightly';
  }

  // Release date
  const releaseDate = (ghRelease.published_at || ghRelease.created_at || new Date().toISOString()).split('T')[0];

  // Separate application assets from checksum metadata files
  const rawAssets = Array.isArray(ghRelease.assets) ? ghRelease.assets : [];
  const appAssets = [];
  const checksumAssets = [];

  for (const asset of rawAssets) {
    if (isChecksumAsset(asset.name)) {
      checksumAssets.push(asset);
    } else {
      const plat = parsePlatform(asset.name);
      if (plat) {
        appAssets.push(asset);
      }
    }
  }

  // Extract checksums from markdown body
  const bodyChecksums = extractChecksumsFromText(
    ghRelease.body || '',
    appAssets.map(a => a.name)
  );

  // If dedicated checksum file assets exist (e.g. SHA256SUMS.txt, foo.sha256), fetch and extract hashes
  for (const cAsset of checksumAssets) {
    if (cAsset && cAsset.browser_download_url) {
      try {
        console.log(`[sync-releases] Fetching checksum asset: ${cAsset.name}`);
        const textRes = await fetchText(cAsset.browser_download_url);
        if (textRes.ok && textRes.text) {
          // 1. Line-by-line matching
          const fileChecksums = extractChecksumsFromText(textRes.text, appAssets.map(a => a.name));
          Object.assign(bodyChecksums, fileChecksums);

          // 2. Individual direct file hash (e.g. package.exe.sha256 containing just the hash)
          const baseTarget = cAsset.name.replace(/\.sha256$/i, '').replace(/\.sha256sum$/i, '');
          const targetAsset = appAssets.find(a => a.name.toLowerCase() === baseTarget.toLowerCase());
          if (targetAsset) {
            const directHash = textRes.text.trim().split(/\s+/)[0];
            if (isValidSha256(directHash)) {
              bodyChecksums[targetAsset.name] = directHash.toLowerCase();
            }
          }
        }
      } catch (err) {
        console.warn(`[sync-releases] Could not fetch checksum asset ${cAsset.name} (${err.message}). Continuing.`);
      }
    }
  }

  // Map application artifacts
  const artifacts = appAssets.map(asset => {
    const platform = parsePlatform(asset.name);
    const architecture = parseArchitecture(asset.name, platform);
    const ext = path.extname(asset.name).toLowerCase();
    const format = ext ? `${ext} package` : 'Binary package';
    const rawChecksum = bodyChecksums[asset.name] || null;
    const checksum = isValidSha256(rawChecksum) ? rawChecksum.toLowerCase() : null;

    return {
      platform,
      architecture,
      format,
      fileName: asset.name,
      fileSize: formatBytes(asset.size),
      downloadUrl: asset.browser_download_url,
      checksum,
      checksumAlgorithm: 'SHA-256',
      available: Boolean(asset.browser_download_url)
    };
  });

  // Determine status
  const hasUsableArtifacts = artifacts.some(a => a.available && a.downloadUrl);
  const status = hasUsableArtifacts ? 'available' : 'coming-soon';

  // Supported platforms present in this release
  const supportedPlatforms = Array.from(new Set(artifacts.map(a => a.platform)));
  if (supportedPlatforms.length === 0) {
    supportedPlatforms.push('windows', 'macos', 'linux');
  }

  // Extract bullet points from body for whatsNew
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
    title,
    releaseDate,
    channel,
    status,
    description: ghRelease.body ? ghRelease.body.split('\n')[0].replace(/^[#*\s-]+/, '').trim() : `SIGANALYZER ${version} release.`,
    whatsNew: whatsNew.length > 0 ? whatsNew.slice(0, 8) : [
      'Automated IQ & WAV signal analysis engine update.',
      'Performance enhancements and stability improvements.'
    ],
    releaseNotes: ghRelease.body || `Official release notes for SIGANALYZER v${version}.`,
    htmlUrl: ghRelease.html_url || `https://github.com/${REPO}/releases/tag/${tag}`,
    supportedPlatforms,
    artifacts,
    knownIssues: []
  };
}

/**
 * Main execution
 */
async function sync() {
  console.log('[sync-releases] Fetching releases from GitHub API...');
  const apiUrl = `https://api.github.com/repos/${REPO}/releases?per_page=50`;

  try {
    const response = await fetchJson(apiUrl);

    if (!response.ok) {
      console.warn(`[sync-releases] GitHub API responded with status ${response.status}: ${response.message}`);
      console.warn('[sync-releases] Preserving existing releases.json snapshot.');
      return;
    }

    const ghReleases = response.data;
    if (!Array.isArray(ghReleases)) {
      console.warn('[sync-releases] Unexpected API response format (expected array). Preserving existing data.');
      return;
    }

    console.log(`[sync-releases] Discovered ${ghReleases.length} releases on GitHub.`);

    // Filter out draft releases
    const publicReleases = ghReleases.filter(r => !r.draft);

    if (publicReleases.length === 0) {
      console.log('[sync-releases] No public releases found on GitHub. Preserving existing releases snapshot.');
      return;
    }

    // Transform into internal release schema with per-release error isolation
    const transformed = [];
    for (const ghRelease of publicReleases) {
      try {
        const rel = await transformGitHubRelease(ghRelease);
        if (rel && rel.version) {
          transformed.push(rel);
        }
      } catch (err) {
        console.warn(`[sync-releases] Warning: Failed to parse release ${ghRelease.tag_name || ghRelease.id}: ${err.message}. Skipping.`);
      }
    }

    if (transformed.length === 0) {
      console.log('[sync-releases] No valid releases could be processed. Preserving existing snapshot.');
      return;
    }

    // Sort newest to oldest by date
    transformed.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());

    // Write formatted JSON
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(transformed, null, 2), 'utf-8');
    console.log(`[sync-releases] Successfully synced ${transformed.length} releases to ${OUTPUT_FILE}`);

    // Write universal ESM snapshot module
    const esmContent = `/**
 * SIGANALYZER Bundled Release Snapshot
 * Generated and updated automatically by scripts/sync-releases.js
 * Source of Truth: GitHub Releases (${REPO})
 */

export const RELEASES_SNAPSHOT = ${JSON.stringify(transformed, null, 2)};
`;
    fs.writeFileSync(OUTPUT_JS, esmContent, 'utf-8');
    console.log(`[sync-releases] Successfully synced ${transformed.length} releases to ${OUTPUT_JS}`);
  } catch (err) {
    console.warn(`[sync-releases] Network or parsing error: ${err.message}`);
    console.warn('[sync-releases] Preserving existing releases snapshot.');
  }
}

sync();
