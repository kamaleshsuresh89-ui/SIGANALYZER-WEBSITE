#!/usr/bin/env node
/**
 * SIGANALYZER GitHub Release Synchronization Script
 * 
 * Fetches releases from GitHub Releases API (kamaleshsuresh89-ui/SIGANALYZER),
 * parses desktop application artifacts (Windows, macOS, Linux),
 * extracts architectures, file sizes, and SHA-256 checksums,
 * and updates src/data/releases.json.
 * 
 * Safe & Resilient:
 * - Falls back to existing releases.json on network/API failure (zero crashes).
 * - Never includes draft releases.
 * - Never fabricates checksums or download URLs.
 * - Desktop application platforms only (strictly excludes mobile).
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
const REPO = process.env.GITHUB_REPOSITORY || 'kamaleshsuresh89-ui/SIGANALYZER';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';

console.log(`[sync-releases] Target Repository: ${REPO}`);
console.log(`[sync-releases] Output JSON: ${OUTPUT_FILE}`);
console.log(`[sync-releases] Output JS:   ${OUTPUT_JS}`);

/**
 * Make an HTTPS GET request returning a Promise
 */
function fetchJson(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const defaultHeaders = {
      'User-Agent': 'SIGANALYZER-Release-Sync/1.0',
      'Accept': 'application/vnd.github.v3+json',
      ...headers
    };

    if (GITHUB_TOKEN) {
      defaultHeaders['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    https.get(url, { headers: defaultHeaders }, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchJson(res.headers.location, headers));
      }

      let rawData = '';
      res.on('data', chunk => { rawData += chunk; });
      res.on('end', () => {
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
 * Parse desktop platform from asset filename
 * STRICTLY Windows, macOS, Linux only.
 */
function parsePlatform(fileName) {
  const name = fileName.toLowerCase();

  // Strictly exclude mobile files
  if (name.includes('android') || name.includes('.apk') || name.includes('.ipa') || name.includes('ios')) {
    return null;
  }

  if (name.includes('win') || name.endsWith('.exe') || name.endsWith('.msi')) {
    return 'windows';
  }
  if (name.includes('mac') || name.includes('darwin') || name.endsWith('.dmg') || name.includes('osx')) {
    return 'macos';
  }
  if (name.includes('linux') || name.endsWith('.appimage') || name.endsWith('.deb') || name.endsWith('.tar.gz') || name.endsWith('.rpm')) {
    return 'linux';
  }

  return null;
}

/**
 * Infer CPU architecture from filename
 */
function parseArchitecture(fileName, platform) {
  const name = fileName.toLowerCase();

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
 * Extract SHA-256 checksums from release body markdown
 */
function extractChecksumsFromBody(body, assetNames) {
  const checksumMap = {};
  if (!body) return checksumMap;

  // Regex matching SHA-256 64-hex strings
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
 * Transform a GitHub Release API object into the SIGANALYZER Release model
 */
function transformGitHubRelease(ghRelease) {
  const tag = ghRelease.tag_name || '';
  const version = tag.replace(/^v/i, '').trim();
  const isPrerelease = Boolean(ghRelease.prerelease);
  const nameLower = (ghRelease.name || '').toLowerCase() + tag.toLowerCase();

  // Channel classification
  let channel = 'stable';
  if (isPrerelease) {
    channel = 'beta';
  }
  if (nameLower.includes('nightly') || nameLower.includes('dev')) {
    channel = 'nightly';
  }

  // Release date
  const releaseDate = (ghRelease.published_at || ghRelease.created_at || new Date().toISOString()).split('T')[0];

  // Separate application assets from checksum metadata files
  const rawAssets = ghRelease.assets || [];
  const appAssets = [];
  let checksumAsset = null;

  for (const asset of rawAssets) {
    const aName = asset.name.toLowerCase();
    if (aName.includes('sha256') || aName.includes('checksum') || aName.endsWith('.sig')) {
      checksumAsset = asset;
    } else {
      const plat = parsePlatform(asset.name);
      if (plat) {
        appAssets.push(asset);
      }
    }
  }

  // Extract checksums from body
  const bodyChecksums = extractChecksumsFromBody(
    ghRelease.body || '',
    appAssets.map(a => a.name)
  );

  // Map application artifacts
  const artifacts = appAssets.map(asset => {
    const platform = parsePlatform(asset.name);
    const architecture = parseArchitecture(asset.name, platform);
    const ext = path.extname(asset.name).toLowerCase();
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

  // Determine status
  const status = artifacts.length > 0 ? 'available' : 'coming-soon';

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
      console.log('[sync-releases] No public releases found on GitHub. Keeping default technical preview.');
      return;
    }

    // Transform into internal release schema
    const transformed = publicReleases.map(transformGitHubRelease);

    // Sort newest to oldest
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
