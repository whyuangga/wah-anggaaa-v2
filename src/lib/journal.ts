/** Jurnal markdown: glob mentah + parser frontmatter + renderer mini. */

export interface Post {
  slug: string;
  title: string;
  date: string;
  desc: string;
  tags: string[];
  html: string;
}

const files = import.meta.glob('../../content/journal/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** inline: code, bold, italic, link (setelah escape) */
function inline(s: string): string {
  return esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

/** blok: fence, heading, quote, list, hr, paragraf */
function render(md: string): string {
  const lines = md.split('\n');
  let html = '';
  let i = 0;
  let inList = false;
  const closeList = () => {
    if (inList) {
      html += '</ul>';
      inList = false;
    }
  };
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('```')) {
      closeList();
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) buf.push(lines[i++]);
      html += `<pre><code>${esc(buf.join('\n'))}</code></pre>`;
      i++;
      continue;
    }
    const h2 = line.match(/^##\s+(.+)$/);
    if (h2) {
      closeList();
      html += `<h2>${inline(h2[1])}</h2>`;
      i++;
      continue;
    }
    const h1 = line.match(/^#\s+(.+)$/);
    if (h1) {
      closeList();
      html += `<h2>${inline(h1[1])}</h2>`;
      i++;
      continue;
    }
    if (line.startsWith('> ')) {
      closeList();
      html += `<blockquote>${inline(line.replace(/^>\s?/, ''))}</blockquote>`;
      i++;
      continue;
    }
    const li = line.match(/^-\s+(.+)$/);
    if (li) {
      if (!inList) {
        html += '<ul>';
        inList = true;
      }
      html += `<li>${inline(li[1])}</li>`;
      i++;
      continue;
    }
    if (/^---+$/.test(line.trim())) {
      closeList();
      html += '<hr />';
      i++;
      continue;
    }
    if (line.trim() === '') {
      closeList();
      i++;
      continue;
    }
    closeList();
    html += `<p>${inline(line)}</p>`;
    i++;
  }
  closeList();
  return html;
}

function parse(raw: string, path: string): Post {
  const slug = path.split('/').pop()!.replace(/\.md$/, '');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`frontmatter hilang: ${slug}`);
  const fm: Record<string, string> = {};
  for (const line of m[1].split('\n')) {
    const k = line.match(/^(\w+):\s*(.+)$/);
    if (k) fm[k[1]] = k[2].trim();
  }
  const tags = (fm.tags ?? '')
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
  return {
    slug,
    title: fm.title ?? slug,
    date: fm.date ?? '',
    desc: fm.desc ?? '',
    tags,
    html: render(m[2].trim()),
  };
}

export const POSTS: Post[] = Object.entries(files)
  .map(([path, raw]) => parse(raw, path))
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const bulan = [
    'jan', 'feb', 'mar', 'apr', 'mei', 'jun',
    'jul', 'agu', 'sep', 'okt', 'nov', 'des',
  ];
  return `${d} ${bulan[m - 1]} ${y}`;
}
