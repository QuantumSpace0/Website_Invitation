// ============================================================================
//  lib/mirror_serve.mjs
//
//  Static file server for a mirror/ directory. Strips CSP/integrity headers,
//  resolves __qHASH filenames, serves index.html as the default. Used as
//  the contents of each mirror's serve.mjs.
//
//  This file is loaded both as a library (during pipeline-time tests) and
//  copied into each mirror as serve.mjs (so the user can run it standalone).
// ============================================================================

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const MIME = {
  '.html':'text/html; charset=utf-8','.htm':'text/html; charset=utf-8',
  '.js':'application/javascript; charset=utf-8','.mjs':'application/javascript; charset=utf-8',
  '.cjs':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8',
  '.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png',
  '.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.webp':'image/webp',
  '.avif':'image/avif','.ico':'image/x-icon','.woff':'font/woff','.woff2':'font/woff2',
  '.ttf':'font/ttf','.otf':'font/otf','.eot':'application/vnd.ms-fontobject',
  '.mp4':'video/mp4','.webm':'video/webm','.mp3':'audio/mpeg','.wav':'audio/wav',
  '.txt':'text/plain; charset=utf-8','.map':'application/json',
  '.glsl':'text/plain; charset=utf-8','.riv':'application/octet-stream',
  '.wasm':'application/wasm','.xml':'application/xml; charset=utf-8',
};

function shouldServeSpaFallback(req, urlPath) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return false;
  if (urlPath.startsWith('/_')) return false;

  const base = path.basename(urlPath);
  if (base.includes('.')) return false;

  const accept = String(req.headers.accept || '');
  return !accept || accept.includes('text/html') || accept.includes('*/*');
}

// A top-level document request (as opposed to a script/image/fetch), judged the
// same way the SPA fallback judges it: HTML-accepting GET with no file extension.
function isNavigation(req, urlPath) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return false;
  if (urlPath.startsWith('/_')) return false;
  const base = path.basename(urlPath);
  if (base.includes('.') && base !== 'index.html') return false;
  return String(req.headers.accept || '').includes('text/html');
}

// The capture stores files host-qualified (mirror/<host>/<path>), and rewrites
// the entry HTML to match. Absolute URLs baked *inside* JS bundles are not
// rewritten, so a site served from a base path (Vite `base`, a router
// basepath, /_next, …) still asks for /forge/assets/x.js and would 404.
// Reading manifest.json lets us retry those under each mirrored host.
function readManifest(root) {
  try {
    const m = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
    const hosts = [];
    if (m.targetHost) hosts.push(m.targetHost);
    for (const h of m.mirroredHosts || []) if (!hosts.includes(h)) hosts.push(h);

    // Directory the site actually lives at, e.g. "/forge/" — the router
    // basepath must match on first paint or the SPA renders nothing.
    let entryDir = '/';
    try {
      const p = new URL(m.finalUrl || m.url).pathname;
      entryDir = p.endsWith('/') ? p : p.replace(/[^/]*$/, '');
    } catch {}

    return { hosts, entryDir };
  } catch {
    return { hosts: [], entryDir: '/' };
  }
}

export function createMirrorServer({ root, log = () => {} } = {}) {
  if (!root) throw new Error('createMirrorServer: root required');
  root = path.resolve(root);

  const { hosts, entryDir } = readManifest(root);
  // '' = the rewritten copy at the mirror root; then each mirrored host dir.
  const prefixes = ['', ...hosts];

  // Resolve a URL path against every prefix, honouring __qHASH captures.
  const resolve = (urlPath) => {
    for (const prefix of prefixes) {
      const candidatePath = path.normalize(path.join(root, prefix, urlPath));
      if (!candidatePath.startsWith(root)) continue;
      if (fs.existsSync(candidatePath) && fs.statSync(candidatePath).isFile()) return candidatePath;

      const dir = path.dirname(candidatePath);
      const base = path.basename(candidatePath);
      if (!fs.existsSync(dir)) continue;
      const hashed = fs.readdirSync(dir).find(n => n.startsWith(base + '__q'));
      if (hashed) return path.join(dir, hashed);
    }
    return null;
  };

  return http.createServer((req, res) => {
    try {
      // CORS allow-all so mirrored bundles don't choke on cross-origin reads
      // (we serve everything from one origin anyway, but some checks read these).
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
      res.setHeader('Access-Control-Allow-Headers', '*');

      if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

      const search = (req.url || '').includes('?') ? '?' + req.url.split('?').slice(1).join('?') : '';
      let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);

      // A client-side router only matches on location.pathname, so a document
      // must be served at the pathname the site really uses. Two rewrites:
      //   /            -> /forge/        (base-path sites render nothing at /)
      //   /ui8.ai/forge/ -> /forge/      (host-qualified capture path)
      // Navigations only — subresources are served in place, no extra hop.
      if (isNavigation(req, urlPath)) {
        let realPath = urlPath;

        const seg = urlPath.split('/')[1];
        if (seg && hosts.includes(seg)) realPath = '/' + urlPath.split('/').slice(2).join('/');
        if (realPath === '' || realPath === '/') realPath = entryDir;

        if (realPath !== urlPath) {
          res.writeHead(302, { Location: realPath + search });
          res.end();
          log(`302 ${req.method} ${urlPath} -> ${realPath}`);
          return;
        }
      }

      if (urlPath === '/' || urlPath === '') urlPath = '/index.html';
      if (urlPath.endsWith('/')) urlPath += 'index.html';

      if (path.normalize(path.join(root, urlPath)).startsWith(root) === false) {
        res.writeHead(403); res.end('forbidden'); return;
      }

      let target = resolve(urlPath);

      if (!target && shouldServeSpaFallback(req, urlPath)) {
        target = resolve(path.posix.join(entryDir, 'index.html')) || resolve('/index.html');
      }

      if (!target) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`Not found: ${urlPath}`);
        log(`404 ${req.method} ${urlPath}`);
        return;
      }

      // __qHASH query-suffixed captures (e.g. css2.css__qab85251c) — strip the
      // suffix so the real extension drives the MIME type.
      const ext = path.extname(path.basename(target).replace(/__q[0-9a-f]+$/i, '')).toLowerCase();
      const ct  = MIME[ext] || 'application/octet-stream';
      const stat = fs.statSync(target);

      // Strip CSP / integrity / strict transport — these break local serving.
      res.removeHeader && res.removeHeader('Content-Security-Policy');
      res.removeHeader && res.removeHeader('Content-Security-Policy-Report-Only');
      res.removeHeader && res.removeHeader('X-Frame-Options');
      res.removeHeader && res.removeHeader('Strict-Transport-Security');

      res.writeHead(200, {
        'Content-Type': ct,
        'Content-Length': stat.size,
        'Cache-Control': 'no-store',
      });
      if (req.method === 'HEAD') { res.end(); return; }
      fs.createReadStream(target).pipe(res);
      log(`200 ${req.method} ${urlPath}  (${path.relative(root, target)})`);
    } catch (e) {
      try { res.writeHead(500); res.end(String(e.message || e)); } catch {}
      log(`500 ${req.method} ${req.url}: ${e.message}`);
    }
  });
}

// Allow this file to be invoked directly: `node serve.mjs [port] [root]`
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  const port = parseInt(process.argv[2], 10) || 8765;
  const root = process.argv[3] || path.dirname(__filename);
  const srv = createMirrorServer({ root, log: console.log });
  srv.listen(port, () => {
    console.log(`mirror serving ${root} at http://127.0.0.1:${port}/`);
  });
}
