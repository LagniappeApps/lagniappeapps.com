// Builds the static site from content/*.md into _site/. No dependencies, no client-side JS.
// Usage: GO_LIVE_DATE="November 2, 2026" node scripts/build.mjs [--strict]
//   --strict fails if GO_LIVE_DATE is unset or any {{placeholder}} / [BRACKET] placeholder remains.
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, '_site');
const strict = process.argv.includes('--strict');
const goLive = (process.env.GO_LIVE_DATE ?? '').trim();
if (strict && !goLive) {
  console.error('GO_LIVE_DATE is not set (use the real go-live date; never backdate).');
  process.exit(1);
}

// path: output dir ('' = site root); title; source markdown
const pages = [
  { path: '', title: 'Home', src: 'home.md' },
  { path: 'contact', title: 'Contact', src: 'contact.md' },
  { path: 'privacy', title: 'Privacy', src: 'privacy.md' },
  { path: 'privacy/habit-tracker', title: 'Privacy Policy: our habit tracker app', src: 'privacy-habit-tracker.md' },
  { path: 'terms', title: 'Terms', src: 'terms.md' },
  { path: 'terms/habit-tracker', title: 'Terms of Use: our habit tracker app', src: 'terms-habit-tracker.md' },
  { path: 'support', title: 'Support', src: 'support.md' },
  { path: 'delete', title: 'Delete your data', src: 'delete.md' },
  { path: 's', title: 'Open in the app', src: 's.md', noindex: true },
];
const nav = [
  ['', 'Home'],
  ['contact', 'Contact'],
  ['support', 'Support'],
  ['privacy', 'Privacy'],
  ['terms', 'Terms'],
  ['delete', 'Delete data'],
];

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slug = (s) =>
  s
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

function inline(s) {
  const links = [];
  let h = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => {
    links.push(`<a href="${esc(u)}">${esc(t)}</a>`);
    return `\u0000${links.length - 1}\u0000`;
  });
  h = esc(h)
    .replace(/(https:\/\/[^\s<]+[^\s<.,;:)])/g, '<a href="$1">$1</a>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])_([^_]+)_(?=$|[\s.,)])/g, '$1<em>$2</em>')
    .replace(/(^|[\s(])\*([^*]+)\*(?=$|[\s.,)])/g, '$1<em>$2</em>');
  return h.replace(/\u0000(\d+)\u0000/g, (_, i) => links[Number(i)]);
}

function render(md) {
  const out = [];
  let para = [];
  let list = null;
  const lines = md.split('\n');
  const flushPara = () => {
    if (para.length) out.push(`<p>${para.map(inline).join('<br>\n')}</p>`);
    para = [];
  };
  const flush = () => {
    flushPara();
    if (list) out.push(`</${list}>`);
    list = null;
  };
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trimEnd();
    let m;
    if (!line.trim()) flush();
    else if ((m = line.match(/^(#{1,6})\s+(.*?)(?:\s+\{#([a-z0-9-]+)\})?$/))) {
      flush();
      const n = m[1].length;
      const html = inline(m[2]);
      out.push(`<h${n} id="${m[3] ?? slug(html)}">${html}</h${n}>`);
    } else if (line.startsWith('|')) {
      flush();
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) rows.push(lines[i++].trim());
      i--;
      const cells = (r) => r.replace(/^\||\|$/g, '').split('|').map((c) => inline(c.trim()));
      const [head, , ...body] = rows;
      out.push('<div class="table"><table>');
      out.push(`<thead><tr>${cells(head).map((c) => `<th scope="col">${c}</th>`).join('')}</tr></thead>`);
      out.push('<tbody>');
      for (const r of body) out.push(`<tr>${cells(r).map((c) => `<td>${c}</td>`).join('')}</tr>`);
      out.push('</tbody></table></div>');
    } else if ((m = line.match(/^\s*(?:[-*]|(\d+)\.)\s+(.*)$/)) && !/^\s{3,}/.test(line)) {
      const type = m[1] ? 'ol' : 'ul';
      flushPara();
      if (list !== type) {
        if (list) out.push(`</${list}>`);
        out.push(`<${type}>`);
        list = type;
      }
      out.push(`<li>${inline(m[2])}</li>`);
    } else if (list && (m = line.match(/^\s+[-*]\s+(.*)$/))) {
      // one level of nested bullets
      const prev = out.pop();
      const inner = prev.endsWith('</ul></li>')
        ? prev.replace(/<\/ul><\/li>$/, `<li>${inline(m[1])}</li></ul></li>`)
        : prev.replace(/<\/li>$/, `<ul><li>${inline(m[1])}</li></ul></li>`);
      out.push(inner);
    } else if (list && /^\s+\S/.test(line)) {
      out[out.length - 1] = out[out.length - 1].replace(/<\/li>$/, ` ${inline(line.trim())}</li>`);
    } else {
      if (list) flush();
      para.push(line.trim());
    }
  }
  flush();
  return out.join('\n');
}

function page({ path, title, src, noindex }) {
  const depth = path ? path.split('/').length : 0;
  const up = depth ? '../'.repeat(depth) : './';
  const href = (p) => (p ? `${up}${p}/` : up);
  let md = readFileSync(join(root, 'content', src), 'utf8');
  md = md.replaceAll('{{GO_LIVE_DATE}}', goLive || '[GO-LIVE DATE]');
  const body = render(md);
  const current = (p) => (p === path || (p && path.startsWith(`${p}/`)) ? ' aria-current="page"' : '');
  const links = nav.map(([p, t]) => `<a href="${href(p)}"${current(p)}>${t}</a>`).join('\n');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'self'; img-src 'self'; base-uri 'none'; form-action 'none'">
<meta name="referrer" content="no-referrer">
${noindex ? '<meta name="robots" content="noindex, nofollow">\n' : ''}<title>${esc(title)} | LAGNIAPPE SOLUTIONS LLC</title>
<meta name="description" content="LAGNIAPPE SOLUTIONS LLC, a small, bootstrapped mobile app studio.">
<link rel="stylesheet" href="${up}styles.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header>
<a class="brand" href="${href('')}">Lagniappe</a>
<nav aria-label="Main">
${links}
</nav>
</header>
<main id="main">
${body}
</main>
<footer>
<nav aria-label="Footer">
${links}
</nav>
<p>© 2026 LAGNIAPPE SOLUTIONS LLC · <a href="mailto:admin@lagniappeapps.com">admin@lagniappeapps.com</a></p>
</footer>
</body>
</html>
`;
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
const problems = [];
for (const p of pages) {
  const dir = join(out, p.path);
  mkdirSync(dir, { recursive: true });
  const html = page(p);
  for (const m of html.matchAll(/\{\{[^}]+\}\}|\[(?:[A-Z0-9][A-Z0-9 _-]{1,})\](?!\()|TODO/g))
    problems.push(`${p.path || '/'}: ${m[0]}`);
  writeFileSync(join(dir, 'index.html'), html);
  console.log(`wrote _site/${p.path ? `${p.path}/` : ''}index.html`);
}
cpSync(join(root, 'public'), out, { recursive: true });
// The app name isn't locked: no product name may appear anywhere in the built site.
const banned = [/tiny\s*wins/i];
const bannedHits = [];
const walk = (d) =>
  readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)],
  );
for (const f of walk(out)) {
  const text = readFileSync(f, 'utf8');
  for (const re of banned) if (re.test(text)) bannedHits.push(`${f.slice(out.length)}: banned name ${re}`);
}
if (problems.length) {
  console.error(`Problems:\n  ${problems.join('\n  ')}`);
  if (strict) process.exit(1);
}
if (bannedHits.length) {
  console.error(`Banned names in _site (always fatal):\n  ${bannedHits.join('\n  ')}`);
  process.exit(1);
}
