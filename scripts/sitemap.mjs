/** prebuild: hasilkan public/sitemap.xml dari route statis + karya + jurnal. */
import fs from 'fs';

const SITE = 'https://whyuangga.github.io/wah-anggaaa-v2';
const today = new Date().toISOString().slice(0, 10);

const worksSrc = fs.readFileSync('src/data/works.ts', 'utf8');
const slugs = [...worksSrc.matchAll(/slug: '([^']+)'/g)].map((m) => m[1]);
const posts = fs
  .readdirSync('content/journal')
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace(/\.md$/, ''));

const urls = [
  '',
  '/about',
  '/contact',
  '/journal',
  ...slugs.map((s) => `/works/${s}`),
  ...posts.map((s) => `/journal/${s}`),
];

const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls
    .map((u) => `  <url><loc>${SITE}${u || '/'}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n') +
  '\n</urlset>\n';

fs.writeFileSync('public/sitemap.xml', xml);
console.log(`sitemap: ${urls.length} url → public/sitemap.xml`);
