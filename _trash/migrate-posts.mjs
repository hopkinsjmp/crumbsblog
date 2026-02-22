/**
 * migrate-posts.mjs
 *
 * Fetches blog posts from crumbsofsanity.com and converts them into
 * TinaCMS-compatible .md files in content/posts/.
 *
 * Usage:
 *   node migrate-posts.mjs
 */

import fetch from 'node-fetch';
import TurndownService from 'turndown';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── URLs to migrate ───────────────────────────────────────────────────────────
const URLS = [
  'https://www.crumbsofsanity.com/2026/01/celebrations-commiserations-and.html',
  'https://www.crumbsofsanity.com/2026/01/an-ode-to-cream-ok-so-this-isnt-ode.html',
  'https://www.crumbsofsanity.com/2026/01/inspired-to-nourish-rainbow-noodles.html',
  'https://www.crumbsofsanity.com/2025/07/coming-up-for-air-gentle-roast-of.html',
  'https://www.crumbsofsanity.com/2025/07/xxx.html',
  'https://www.crumbsofsanity.com/2025/06/a-soothing-smoothie-bowl-1-cashew-and.html',
  'https://www.crumbsofsanity.com/2025/06/soak-blend-breathe-or-cashew-milk-for.html',
  'https://www.crumbsofsanity.com/2025/06/the-classic-broccoli-and-gorgonzola-soup.html',
];

// ── Turndown config ───────────────────────────────────────────────────────────
const td = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
});

// Remove inline styles, scripts, and nav/header/footer noise
td.remove(['style', 'script', 'noscript', 'iframe', 'nav', 'header', 'footer', '.post-labels', '.post-share', '.post-navigation', '.comments', '#comments']);

// Keep images as markdown
td.addRule('images', {
  filter: 'img',
  replacement: (_, node) => {
    const src = node.getAttribute('src') || '';
    const alt = node.getAttribute('alt') || '';
    if (!src || src.startsWith('{')) return ''; // skip template placeholders
    return `![${alt}](${src})`;
  },
});

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Derive a slug from the URL path segment (without .html) */
function slugFromUrl(url) {
  return url.split('/').pop().replace(/\.html$/, '');
}

/** Pull text content from an element matched by selector, or return fallback */
function getText(doc, selector, fallback = '') {
  // Simple regex-based extraction since we're not in a browser
  const re = new RegExp(`<${selector}[^>]*>([\\s\\S]*?)<\\/${selector}>`, 'i');
  const m = doc.match(re);
  return m ? m[1].replace(/<[^>]+>/g, '').trim() : fallback;
}

/** Extract the first <meta name="description" content="..."> value */
function getMetaDescription(html) {
  const m = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
  return m ? m[1].trim() : '';
}

/** Extract <title> text (strip site suffix) */
function getPageTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!m) return '';
  return decodeEntities(
    m[1]
      .replace(/\s*[-|–—]\s*Crumbs of Sanity.*$/i, '')
      .replace(/<[^>]+>/g, '')
      .trim()
  );
}

/** Extract the <article> or fallback to .post-body / .post-container */
function extractArticleHtml(html) {
  // Try <article ...> first
  const articleMatch = html.match(/<article[\s\S]*?>([\s\S]*?)<\/article>/i);
  if (articleMatch) return articleMatch[1];

  // Fall back to .post-body
  const bodyMatch = html.match(/class=["'][^"']*post-body[^"']*["'][\s\S]*?>([\s\S]*?)<\/div>/i);
  if (bodyMatch) return bodyMatch[1];

  // Fall back to <main>
  const mainMatch = html.match(/<main[\s\S]*?>([\s\S]*?)<\/main>/i);
  if (mainMatch) return mainMatch[1];

  return html;
}

/** Extract post date from meta timestamp or page text */
function extractDate(html) {
  // og:article:published_time
  const ogDate = html.match(/<meta[^>]+property=["']article:published_time["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"'T]+T?[^"']+)["'][^>]+property=["']article:published_time["']/i);
  if (ogDate) return new Date(ogDate[1]).toISOString();

  // .post-timestamp text like "February 2026"
  const tsMatch = html.match(/class=["'][^"']*post-timestamp[^"']*["'][^>]*>([^<]+)</i);
  if (tsMatch) {
    const d = new Date(tsMatch[1].trim());
    if (!isNaN(d.getTime())) return d.toISOString();
    // "February 2026" → first of that month
    const parts = tsMatch[1].trim().match(/^(\w+)\s+(\d{4})$/);
    if (parts) return new Date(`${parts[1]} 1, ${parts[2]}`).toISOString();
  }

  // <time datetime="...">
  const timeEl = html.match(/<time[^>]+datetime=["']([^"']+)["']/i);
  if (timeEl) return new Date(timeEl[1]).toISOString();

  return new Date().toISOString();
}

/** Extract post header/title area and body separately */
function extractPostParts(html) {
  // Remove the post-header block so it doesn't duplicate in body markdown
  const withoutHeader = html.replace(/<div[^>]+class=["'][^"']*post-header[^"']*["'][^>]*>[\s\S]*?<\/div>\s*/i, '');
  // Remove featured image placeholder divs
  const withoutFeatured = withoutHeader.replace(/<div[^>]+class=["'][^"']*post-featured-image[^"']*["'][^>]*>[\s\S]*?<\/div>\s*/i, '');
  return withoutFeatured;
}

/** Decode common HTML entities */
function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

/** Escape YAML string values */
function yamlStr(s) {
  const clean = decodeEntities(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ').trim();
  return `"${clean}"`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function migrateUrl(url) {
  console.log(`\nFetching: ${url}`);

  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; crumbsblog-migrator/1.0)' },
  });

  if (!res.ok) {
    console.error(`  ✗ HTTP ${res.status} — skipping`);
    return;
  }

  const html = await res.text();
  const slug = slugFromUrl(url);

  // ── Extract metadata ──────────────────────────────────────────────────────
  const title = getPageTitle(html) || slug.replace(/-/g, ' ');
  const description = getMetaDescription(html);
  const date = extractDate(html);

  // ── Extract body ──────────────────────────────────────────────────────────
  const articleHtml = extractArticleHtml(html);
  const bodyHtml = extractPostParts(articleHtml);
  let markdown = td.turndown(bodyHtml).trim();

  // Clean up leftover template placeholders like {POST_LABELS}
  markdown = markdown.replace(/\{[A-Z_]+\}/g, '').replace(/\n{3,}/g, '\n\n').trim();

  // ── Build frontmatter ─────────────────────────────────────────────────────
  // excerpt: first substantive paragraph (skip emoji-only bio lines, headers, images)
  const firstPara = markdown
    .split('\n\n')
    .find((p) => {
      const clean = p.replace(/[*_`#!\[\]]/g, '').trim();
      // Skip short lines, emoji-heavy bios, or lines that are just bullets
      if (clean.length < 60) return false;
      if (/^[\p{Emoji}\s•·|]+$/u.test(clean)) return false;
      return true;
    })
    ?.replace(/[*_`]/g, '')
    .slice(0, 280)
    .trim() || '';

  const frontmatter = [
    '---',
    `title: ${yamlStr(title)}`,
    `date: ${date}`,
    description ? `description: ${yamlStr(description)}` : null,
    firstPara ? `excerpt: ${yamlStr(firstPara)}` : null,
    '---',
  ].filter(Boolean).join('\n');

  const fileContent = `${frontmatter}\n\n${markdown}\n`;

  // ── Write file ────────────────────────────────────────────────────────────
  const outDir = join(__dirname, 'content', 'posts');
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, `${slug}.mdx`);
  writeFileSync(outPath, fileContent, 'utf8');

  console.log(`  ✓ Saved → content/posts/${slug}.md`);
  console.log(`    Title : ${title}`);
  console.log(`    Date  : ${date}`);
}

(async () => {
  for (const url of URLS) {
    try {
      await migrateUrl(url);
    } catch (err) {
      console.error(`  ✗ Error processing ${url}:`, err.message);
    }
  }
  console.log('\nDone. Review the files in content/posts/ before committing.');
})();
