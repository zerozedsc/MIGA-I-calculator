import http from 'node:http';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '..', 'dist');

const contentTypeFor = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.js': return 'text/javascript; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.svg': return 'image/svg+xml';
    case '.json': return 'application/json; charset=utf-8';
    case '.txt': return 'text/plain; charset=utf-8';
    case '.xml': return 'application/xml; charset=utf-8';
    case '.ico': return 'image/x-icon';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.webp': return 'image/webp';
    default: return 'application/octet-stream';
  }
};

const safeResolve = (baseDir, urlPath) => {
  const cleaned = urlPath.split('?')[0].split('#')[0];
  const rel = cleaned.startsWith('/') ? cleaned.slice(1) : cleaned;
  const resolved = path.resolve(baseDir, rel);
  if (!resolved.startsWith(baseDir)) {
    return null;
  }
  return resolved;
};

const createStaticServer = () => {
  return http.createServer(async (req, res) => {
    try {
      const urlPath = req.url || '/';
      const targetPath = urlPath === '/' ? path.join(distDir, 'index.html') : safeResolve(distDir, urlPath);

      if (!targetPath) {
        res.statusCode = 400;
        res.end('Bad Request');
        return;
      }

      let filePath = targetPath;

      // If path is a directory, serve index.html
      try {
        const stat = await fs.stat(filePath);
        if (stat.isDirectory()) {
          filePath = path.join(filePath, 'index.html');
        }
      } catch {
        // fallthrough
      }

      // If file doesn't exist, SPA fallback
      try {
        await fs.access(filePath);
      } catch {
        filePath = path.join(distDir, 'index.html');
      }

      const data = await fs.readFile(filePath);
      res.statusCode = 200;
      res.setHeader('Content-Type', contentTypeFor(filePath));
      res.end(data);
    } catch (err) {
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });
};

const server = createStaticServer();

const port = await new Promise((resolve, reject) => {
  server.listen(0, '127.0.0.1', () => {
    const addr = server.address();
    if (!addr || typeof addr === 'string') {
      reject(new Error('Failed to bind server'));
      return;
    }
    resolve(addr.port);
  });
});

const url = `http://127.0.0.1:${port}/`;

try {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });

  // Ensure React rendered something into #root
  await page.waitForSelector('#root > *', { timeout: 15000 });

  const html = await page.content();

  // Tailwind CDN injects a very large <style> block at runtime. Keeping it inside
  // the prerender snapshot can bloat index.html dramatically. Styling is not
  // required for SEO indexing, so we strip that injected style while keeping
  // the rendered DOM content.
  const stripped = html.replace(
    /<style>([\s\S]*?(?:tailwindcss|--tw-)[\s\S]*?)<\/style>/gi,
    ''
  );

  await fs.writeFile(path.join(distDir, 'index.html'), stripped, 'utf8');

  await browser.close();
  console.log('[prerender] Wrote prerendered dist/index.html');
} finally {
  await new Promise((resolve) => server.close(() => resolve()));
}
