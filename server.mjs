import { createServer } from "node:http";
import { createReadStream, existsSync, statSync, readFileSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { request as httpRequest } from "node:http";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const PORT = Number(process.env.PORT) || 19288;
const STATIC = join(__dirname, "static");
const API_PORT = 8080;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
  ".xml": "application/xml",
};

// Read index.html fresh on every request so restarts aren't needed after rebuilds

function proxyToApi(req, res, path) {
  const opts = {
    hostname: "localhost",
    port: API_PORT,
    path,
    method: req.method,
    headers: { ...req.headers, host: `localhost:${API_PORT}` },
  };
  const proxy = httpRequest(opts, (pRes) => {
    res.writeHead(pRes.statusCode, pRes.headers);
    pRes.pipe(res);
  });
  proxy.on("error", (e) => {
    res.writeHead(502);
    res.end("Bad Gateway: " + e.message);
  });
  req.pipe(proxy);
}

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://localhost`);
  const pathname = url.pathname;

  // Proxy /api/* to API server
  if (pathname.startsWith("/api/")) {
    proxyToApi(req, res, req.url);
    return;
  }

  // Proxy /site-data.json to API server (live data)
  if (pathname === "/site-data.json") {
    proxyToApi(req, res, "/api/site-data.json");
    return;
  }

  // Try to serve static file
  const filePath = join(STATIC, pathname === "/" ? "index.html" : pathname);
  if (existsSync(filePath) && statSync(filePath).isFile()) {
    const ext = extname(filePath).toLowerCase();
    const ct = MIME[ext] || "application/octet-stream";
    // Hashed assets (JS/CSS in /assets/) are immutable; HTML must never be cached
    const isHashedAsset = pathname.startsWith("/assets/");
    const cc = isHashedAsset
      ? "public, max-age=31536000, immutable"
      : "no-store, no-cache, must-revalidate, max-age=0";
    res.writeHead(200, { "Content-Type": ct, "Cache-Control": cc });
    createReadStream(filePath).pipe(res);
    return;
  }

  // SPA fallback — always read index.html fresh (never cached)
  const html = readFileSync(join(STATIC, "index.html"));
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" });
  res.end(html);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Kraken Watch static server on port ${PORT}`);
});
