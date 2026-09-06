#!/usr/bin/env node
/**
 * SIGANALYZER Local Development & Preview Server
 * Zero-dependency native Node.js static server with MIME types and SPA fallback.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.mjs': 'text/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=UTF-8',
  '.xml': 'application/xml; charset=UTF-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

// Parse command line args
const portArgIndex = process.argv.indexOf('--port');
const PORT = portArgIndex !== -1 && process.argv[portArgIndex + 1]
  ? parseInt(process.argv[portArgIndex + 1], 10)
  : parseInt(process.env.PORT || '3000', 10);

const dirArgIndex = process.argv.indexOf('--dir');
const SERVE_DIR = dirArgIndex !== -1 && process.argv[dirArgIndex + 1]
  ? path.resolve(ROOT_DIR, process.argv[dirArgIndex + 1])
  : ROOT_DIR;

const server = http.createServer((req, res) => {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Strip query string and decode URI
  const rawUrl = req.url || '/';
  const cleanUrl = rawUrl.split('?')[0];
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(cleanUrl);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Bad Request');
    return;
  }

  // Prevent path traversal
  const safePath = path.normalize(decodedPath).replace(/^(\.\.[/\\])+/, '');
  let filePath = path.join(SERVE_DIR, safePath);

  // If directory, look for index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // Fallback to index.html for root or SPA paths
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    const indexPath = path.join(SERVE_DIR, 'index.html');
    if (fs.existsSync(indexPath)) {
      filePath = indexPath;
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`500 Server Error: ${err.code}`);
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n======================================================`);
  console.log(`  SIGANALYZER Production Website Server running`);
  console.log(`  Local URL:  http://127.0.0.1:${PORT}`);
  console.log(`  Serve Dir:  ${SERVE_DIR}`);
  console.log(`======================================================\n`);
});
