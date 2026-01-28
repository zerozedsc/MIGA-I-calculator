import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '..', 'dist');

const rawSiteUrl = process.env.VITE_SITE_URL || process.env.SITE_URL || '';
const siteUrl = rawSiteUrl.trim().replace(/\/+$/, '');

if (!siteUrl) {
  console.warn('[sitemap] VITE_SITE_URL not set; skipping sitemap.xml generation.');
  process.exit(0);
}

if (!/^https?:\/\//i.test(siteUrl)) {
  console.warn(`[sitemap] VITE_SITE_URL must start with http(s)://. Got: ${siteUrl}. Skipping sitemap.xml generation.`);
  process.exit(0);
}

const urls = [
  { loc: `${siteUrl}/`, changefreq: 'weekly', priority: '1.0' },
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n') +
  `\n</urlset>\n`;

await fs.mkdir(distDir, { recursive: true });
await fs.writeFile(path.join(distDir, 'sitemap.xml'), xml, 'utf8');
console.log(`[sitemap] Wrote ${path.join(distDir, 'sitemap.xml')}`);
