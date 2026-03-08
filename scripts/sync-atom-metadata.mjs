/**
 * sync-atom-metadata.mjs
 *
 * Reads feed.atom and, for every POST entry, finds the matching .mdx file in
 * content/posts/ and patches its frontmatter so that:
 *   - author   → content/authors/Carmel.md
 *   - date     → <published> from the atom entry (ISO string)
 *   - draft    → true  if blogger:status is DRAFT, omitted (or false) if LIVE
 *
 * Matching strategy: normalise both the atom <title> and the mdx filename to
 * lower-case alphanumeric tokens and pick the best overlap score.
 *
 * Run with:  node scripts/sync-atom-metadata.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'content', 'posts');
const ATOM_FILE = path.join(ROOT, 'feed.atom');

// ── helpers ──────────────────────────────────────────────────────────────────

function tokens(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function overlap(a, b) {
  const setB = new Set(b);
  return a.filter((t) => setB.has(t)).length;
}

// ── parse atom ───────────────────────────────────────────────────────────────

const atomXml = fs.readFileSync(ATOM_FILE, 'utf8');

// Extract all POST entries
const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
const posts = [];

for (const match of atomXml.matchAll(entryRegex)) {
  const block = match[1];

  const typeMatch = block.match(/<blogger:type>(.*?)<\/blogger:type>/);
  if (!typeMatch || typeMatch[1] !== 'POST') continue;

  const statusMatch = block.match(/<blogger:status>(.*?)<\/blogger:status>/);
  const titleMatch = block.match(/<title>(.*?)<\/title>/);
  const publishedMatch = block.match(/<published>(.*?)<\/published>/);

  if (!titleMatch || !publishedMatch) continue;

  posts.push({
    title: titleMatch[1].trim(),
    published: publishedMatch[1].trim(),
    status: statusMatch ? statusMatch[1].trim() : 'LIVE',
  });
}

console.log(`Found ${posts.length} POST entries in atom feed.\n`);

// ── load mdx files ───────────────────────────────────────────────────────────

const mdxFiles = fs
  .readdirSync(POSTS_DIR)
  .filter((f) => f.endsWith('.mdx'))
  .map((f) => ({ file: f, toks: tokens(f.replace(/\.mdx$/, '')) }));

// ── match & patch ────────────────────────────────────────────────────────────

const AUTHOR_REF = 'content/authors/Carmel.md';
let patched = 0;
let skipped = 0;

for (const post of posts) {
  const postToks = tokens(post.title);

  // Score each mdx file
  let best = null;
  let bestScore = 0;
  for (const mdx of mdxFiles) {
    const score = overlap(postToks, mdx.toks);
    if (score > bestScore) {
      bestScore = score;
      best = mdx;
    }
  }

  if (!best || bestScore === 0) {
    console.warn(`⚠  No match found for: "${post.title}"`);
    skipped++;
    continue;
  }

  const filePath = path.join(POSTS_DIR, best.file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Extract existing frontmatter
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) {
    console.warn(`⚠  No frontmatter in: ${best.file}`);
    skipped++;
    continue;
  }

  let fm = fmMatch[1];
  const isDraft = post.status === 'DRAFT';

  // --- author ---
  if (/^author:/m.test(fm)) {
    fm = fm.replace(/^author:.*$/m, `author: ${AUTHOR_REF}`);
  } else {
    fm += `\nauthor: ${AUTHOR_REF}`;
  }

  // --- date ---
  if (/^date:/m.test(fm)) {
    fm = fm.replace(/^date:.*$/m, `date: '${post.published}'`);
  } else {
    fm += `\ndate: '${post.published}'`;
  }

  // --- draft ---
  if (isDraft) {
    if (/^draft:/m.test(fm)) {
      fm = fm.replace(/^draft:.*$/m, `draft: true`);
    } else {
      fm += `\ndraft: true`;
    }
  } else {
    // Remove draft line if present (LIVE posts shouldn't have it)
    fm = fm.replace(/^draft:.*\n?/m, '');
  }

  const newContent = content.replace(/^---\n[\s\S]*?\n---/, `---\n${fm}\n---`);

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(
      `✅  ${best.file}\n    title:   "${post.title}"\n    date:    ${post.published}\n    status:  ${post.status}\n`
    );
    patched++;
  } else {
    console.log(`–  ${best.file} (no changes needed)`);
  }
}

console.log(`\nDone. Patched: ${patched}, skipped: ${skipped}`);
