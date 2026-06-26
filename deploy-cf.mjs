#!/usr/bin/env node
// Direct Cloudflare Workers deployment via REST API — no wrangler/npm needed.
// Usage: node deploy-cf.mjs
//
// Requires blake3-wasm at /tmp/wr-src/package/node_modules/blake3-wasm
// (downloaded once per session via: curl -sL https://registry.npmjs.org/blake3-wasm/-/blake3-wasm-2.1.5.tgz | tar -xz -C /tmp/wr-src/package/node_modules/blake3-wasm --strip-components=1)
import { readdir, readFile } from 'fs/promises';
import { join, relative } from 'path';
import { existsSync } from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const ACCOUNT_ID  = 'f1706deefade579c61ef0cbf25bef6ef';
const SCRIPT_NAME = 'wispy-sun-811e';
const TOKEN       = process.env.CLOUDFLARE_API_TOKEN;
const DIST_DIR    = new URL('./dist', import.meta.url).pathname;
const WORKER_SRC  = new URL('./src/worker.js', import.meta.url).pathname;
const COMPAT_DATE = '2026-04-17';
const KV_ID       = '4515258da6c246048f75ce19493764e2';

if (!TOKEN) { console.error('CLOUDFLARE_API_TOKEN not set'); process.exit(1); }

const BASE = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts/${SCRIPT_NAME}`;
const UPLOAD_BASE = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/assets/upload`;

// ── helpers ──────────────────────────────────────────────────────────────────
async function cfetch(url, opts = {}) {
  const r = await fetch(url, {
    ...opts,
    headers: { 'Authorization': `Bearer ${TOKEN}`, ...(opts.headers || {}) },
  });
  const text = await r.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!r.ok || json.success === false) {
    console.error('CF API error', r.status, JSON.stringify(json).slice(0, 600));
    process.exit(1);
  }
  return json;
}

async function walk(dir, base = dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const results = [];
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) results.push(...await walk(full, base));
    else results.push([full, '/' + relative(base, full)]);
  }
  return results;
}

// Load blake3-wasm (Cloudflare's actual hash algo for Workers Assets).
// Falls back to a path that works if the module was pre-downloaded.
function loadBlake3() {
  const paths = [
    '/tmp/wr-src/package/node_modules/blake3-wasm',
    './node_modules/blake3-wasm',
  ];
  for (const p of paths) {
    try { return require(p); } catch {}
  }
  throw new Error('blake3-wasm not found. Run: curl -sL https://registry.npmjs.org/blake3-wasm/-/blake3-wasm-2.1.5.tgz | tar -xz -C /tmp/wr-src/package/node_modules/blake3-wasm --strip-components=1');
}

function hashFile(blake3, buf) {
  const h = blake3.hash(buf);
  // Wrangler uses the full 32-byte blake3 hash encoded as base64url
  return Buffer.from(h).toString('base64url');
}

function mime(path) {
  if (path.endsWith('.html')) return 'text/html; charset=utf-8';
  if (path.endsWith('.js'))   return 'application/javascript';
  if (path.endsWith('.css'))  return 'text/css';
  if (path.endsWith('.json')) return 'application/json';
  if (path.endsWith('.png'))  return 'image/png';
  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg';
  if (path.endsWith('.svg'))  return 'image/svg+xml';
  if (path.endsWith('.ico'))  return 'image/x-icon';
  if (path.endsWith('.woff2')) return 'font/woff2';
  if (path.endsWith('.woff'))  return 'font/woff';
  if (path.endsWith('.ttf'))   return 'font/ttf';
  if (path.endsWith('.xml'))   return 'application/xml';
  if (path.endsWith('.txt'))   return 'text/plain';
  if (path.endsWith('.webp'))  return 'image/webp';
  return 'application/octet-stream';
}

// ── main ─────────────────────────────────────────────────────────────────────
async function main() {
  const blake3 = loadBlake3();
  console.log('blake3-wasm loaded ✓');

  // 1. Collect all dist files + compute blake3 hashes
  console.log('Reading dist/ …');
  if (!existsSync(DIST_DIR)) { console.error('dist/ not found — run pnpm build first'); process.exit(1); }
  const files = await walk(DIST_DIR);
  const fileMap = new Map(); // relPath → { buf, hash }
  for (const [abs, rel] of files) {
    const buf = await readFile(abs);
    const hash = hashFile(blake3, buf);
    fileMap.set(rel, { buf, hash });
  }
  console.log(`  ${fileMap.size} files found`);

  // 2. Start upload session with file manifest (hashes)
  console.log('Starting asset upload session …');
  const manifest = {};
  for (const [rel, { hash }] of fileMap) manifest[rel] = hash;

  const sessionRes = await cfetch(`${BASE}/assets-upload-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(manifest),
  });

  const { jwt, buckets } = sessionRes.result;
  console.log(`  Session JWT obtained.`);
  console.log(`  Buckets needing upload: ${buckets?.length ?? 0}`);

  // 3. Upload files that CF says are missing (per buckets)
  // Each bucket is an array of file hashes that need to be uploaded.
  // Wrangler uses JWT as Bearer for the upload endpoint.
  if (buckets && buckets.length > 0) {
    // Build a reverse map: hash → { buf, rel, mime }
    const hashToFile = new Map();
    for (const [rel, { buf, hash }] of fileMap) {
      hashToFile.set(hash, { buf, rel });
    }

    let batchNum = 0;
    for (const bucket of buckets) {
      batchNum++;
      const form = new FormData();
      let count = 0;
      for (const hash of bucket) {
        const entry = hashToFile.get(hash);
        if (!entry) { console.warn(`  Hash ${hash} not found locally — skipping`); continue; }
        form.append(hash, new Blob([entry.buf], { type: mime(entry.rel) }), entry.rel.slice(1));
        count++;
      }
      const r = await fetch(`${UPLOAD_BASE}?base64=false`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${jwt}` },
        body: form,
      });
      const txt = await r.text();
      let res; try { res = JSON.parse(txt); } catch { res = { raw: txt }; }
      if (!r.ok) {
        console.error(`  Upload batch ${batchNum} FAILED (${r.status}):`, JSON.stringify(res).slice(0, 400));
        process.exit(1);
      }
      console.log(`  Batch ${batchNum}/${buckets.length}: uploaded ${count} files ✓`);
    }
  } else {
    console.log('  All assets already cached by Cloudflare — skipping uploads.');
  }

  // 4. Deploy the worker script with asset JWT
  const workerScript = await readFile(WORKER_SRC, 'utf8');
  console.log('Deploying worker script …');

  const metadata = {
    compatibility_date: COMPAT_DATE,
    main_module: 'worker.js',
    bindings: [
      { type: 'kv_namespace', name: 'SITE_DATA', namespace_id: KV_ID },
      { type: 'assets', name: 'ASSETS' },
    ],
    assets: { jwt },
    keep_bindings: [],
  };

  const deployForm = new FormData();
  deployForm.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }), 'blob');
  deployForm.append('worker.js', new Blob([workerScript], { type: 'application/javascript+module' }), 'worker.js');

  await cfetch(`${BASE}`, {
    method: 'PUT',
    body: deployForm,
  });

  console.log('✅  Deployed successfully!');
}

main().catch(e => { console.error(e); process.exit(1); });
