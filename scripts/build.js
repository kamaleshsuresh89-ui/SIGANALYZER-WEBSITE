#!/usr/bin/env node
/**
 * SIGANALYZER Production Build Script
 * 
 * 1. Synchronizes releases from GitHub Releases API (scripts/sync-releases.js)
 * 2. Compiles and packages the static distribution into dist/:
 *    - dist/index.html
 *    - dist/404.html
 *    - dist/public/ (favicon.svg, robots.txt, sitemap.xml)
 *    - dist/favicon.svg, dist/robots.txt, dist/sitemap.xml (mirrored at root for crawlers)
 *    - dist/src/ (ES modules, styles, components, pages, data)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

console.log(`[build] Initializing SIGANALYZER production build...`);
console.log(`[build] Root Directory:   ${ROOT_DIR}`);
console.log(`[build] Output Directory: ${DIST_DIR}`);

// 1. Run release synchronization
try {
  console.log(`[build] Running release sync...`);
  const syncScript = path.join(ROOT_DIR, 'scripts', 'sync-releases.js');
  execFileSync(process.execPath, [syncScript], {
    cwd: ROOT_DIR,
    stdio: 'inherit',
    env: process.env
  });
} catch (err) {
  console.warn(`[build] Warning: Release sync failed (${err.message}). Continuing with local release snapshot.`);
}

// 2. Clean & recreate dist directory
if (fs.existsSync(DIST_DIR)) {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DIST_DIR, { recursive: true });

/**
 * Recursively copy directory
 */
function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 3. Copy root HTML files
const rootFiles = ['index.html', '404.html'];
for (const file of rootFiles) {
  const src = path.join(ROOT_DIR, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(DIST_DIR, file));
    console.log(`[build] Copied ${file} -> dist/${file}`);
  }
}

// 4. Copy src/ directory
const srcDir = path.join(ROOT_DIR, 'src');
if (fs.existsSync(srcDir)) {
  copyDirSync(srcDir, path.join(DIST_DIR, 'src'));
  console.log(`[build] Copied src/ -> dist/src/`);
}

// 5. Copy public/ directory and mirror assets at dist/ root
const publicDir = path.join(ROOT_DIR, 'public');
if (fs.existsSync(publicDir)) {
  copyDirSync(publicDir, path.join(DIST_DIR, 'public'));
  console.log(`[build] Copied public/ -> dist/public/`);

  // Mirror public assets to root of dist (robots.txt, sitemap.xml, favicon.svg)
  const publicFiles = fs.readdirSync(publicDir);
  for (const pFile of publicFiles) {
    const srcFile = path.join(publicDir, pFile);
    if (fs.statSync(srcFile).isFile()) {
      fs.copyFileSync(srcFile, path.join(DIST_DIR, pFile));
      console.log(`[build] Mirrored public/${pFile} -> dist/${pFile}`);
    }
  }
}

// 6. Verify dist/index.html exists
const distIndex = path.join(DIST_DIR, 'index.html');
if (!fs.existsSync(distIndex)) {
  console.error(`[build] ERROR: dist/index.html was not generated!`);
  process.exit(1);
}

console.log(`[build] Production build completed successfully. Output ready in dist/.`);
