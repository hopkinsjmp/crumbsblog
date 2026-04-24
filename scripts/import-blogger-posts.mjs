#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import TurndownService from 'turndown';

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, 'content', 'posts');
const UPLOADS_DIR = path.join(ROOT, 'public', 'uploads', 'posts');
const FEED_URL = 'https://www.crumbsofsanity.com/feeds/posts/default';
const AUTHOR_REF = 'content/authors/Carmel.md';

const DRY_RUN = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');

function normalizeText(value) {
  return (value || '')
    .toLowerCase()
    .replace(/&amp;/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function slugify(value) {
  const slug = (value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’'"“”]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
  return slug || 'untitled-post';
}

function extractFrontmatterTitle(fileContent) {
  const match = fileContent.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fm = match[1];
  const titleLine = fm.match(/^title:\s*(.+)$/m);
  if (!titleLine) return null;
  return titleLine[1].trim().replace(/^['"]|['"]$/g, '');
}

function getAlternateUrl(entry) {
  const links = entry?.link || [];
  const alt = links.find((l) => l.rel === 'alternate' && l.type === 'text/html');
  return alt?.href || null;
}

function getRemoteSlugFromUrl(url) {
  if (!url) return '';
  const m = url.match(/\/([^/]+)\.html$/i);
  return m ? m[1].toLowerCase() : '';
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function buildExistingIndex() {
  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.mdx'));

  const titleSet = new Set();
  const slugSet = new Set();
  for (const file of files) {
    const fullPath = path.join(POSTS_DIR, file);
    const content = fs.readFileSync(fullPath, 'utf8');
    const title = extractFrontmatterTitle(content);
    if (title) titleSet.add(normalizeText(title));
    slugSet.add(normalizeText(file.replace(/\.mdx$/i, '').replace(/-/g, ' ')));
  }

  return { titleSet, slugSet, filesCount: files.length };
}

async function fetchFeedPage(startIndex, maxResults = 25) {
  const url = `${FEED_URL}?alt=json&start-index=${startIndex}&max-results=${maxResults}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Feed fetch failed (${res.status}) for ${url}`);
  }
  return res.json();
}

async function fetchAllEntries() {
  const entries = [];
  let startIndex = 1;
  const pageSize = 25;

  while (true) {
    const data = await fetchFeedPage(startIndex, pageSize);
    const feed = data?.feed;
    const pageEntries = feed?.entry || [];
    const total = Number(feed?.['openSearch$totalResults']?.$t || 0);

    entries.push(...pageEntries);

    if (entries.length >= total || pageEntries.length === 0) {
      break;
    }
    startIndex += pageSize;
  }

  return entries;
}

function stripInlineNoise(html) {
  return (html || '')
    .replace(/\s*id="docs-internal-guid-[^"]*"/g, '')
    .replace(/\s*dir="ltr"/g, '')
    .replace(/\s*face="[^"]*"/g, '')
    .replace(/\s*style="[^"]*"/g, '')
    .replace(/\u00a0/g, ' ')
    .replace(/<span>\s*<\/span>/g, '');
}

function cleanMarkdown(markdown) {
  return (markdown || '')
    .replace(/\r\n/g, '\n')
    .replace(/\n###\s*\n\s*\*\*Ingredients\*\*\s*\n/g, '\n### Ingredients\n\n')
    .replace(/\n###\s*\n\s*\*\*Instructions\*\*\s*\n/g, '\n### Instructions\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .trim();
}

function detectExtensionFromContentType(contentType) {
  if (!contentType) return '.jpg';
  if (contentType.includes('image/jpeg')) return '.jpg';
  if (contentType.includes('image/png')) return '.png';
  if (contentType.includes('image/webp')) return '.webp';
  if (contentType.includes('image/gif')) return '.gif';
  if (contentType.includes('image/svg+xml')) return '.svg';
  return '.jpg';
}

async function downloadImage(url, outBaseName, index) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Image download failed (${res.status}) for ${url}`);
  }

  const contentType = res.headers.get('content-type') || '';
  const extFromType = detectExtensionFromContentType(contentType);
  const urlPath = new URL(url).pathname;
  const extFromPath = path.extname(urlPath).toLowerCase();
  const ext = extFromPath && extFromPath.length <= 5 ? extFromPath : extFromType;
  const filename = `${outBaseName}-${index}${ext}`;
  const outPath = path.join(UPLOADS_DIR, filename);

  if (!DRY_RUN) {
    const arrayBuffer = await res.arrayBuffer();
    fs.writeFileSync(outPath, Buffer.from(arrayBuffer));
  }

  return `/uploads/posts/${filename}`;
}

async function localizeImages(html, slug) {
  const imgRegex = /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
  const found = [];
  let m;
  while ((m = imgRegex.exec(html)) !== null) {
    found.push(m[1]);
  }

  const unique = [...new Set(found)].filter((src) => /^https?:\/\//i.test(src));
  const replacements = new Map();

  let i = 1;
  for (const src of unique) {
    try {
      const newSrc = await downloadImage(src, slug, i);
      replacements.set(src, newSrc);
      i += 1;
    } catch (err) {
      console.warn(`  ! Failed image: ${src} (${err.message})`);
    }
  }

  let output = html;
  for (const [oldSrc, newSrc] of replacements.entries()) {
    output = output.split(oldSrc).join(newSrc);
  }

  const hero = replacements.size > 0 ? [...replacements.values()][0] : null;
  return { html: output, heroImg: hero, imageCount: replacements.size };
}

function frontmatterFor(post) {
  const lines = [
    '---',
    `title: ${JSON.stringify(post.title)}`,
    `date: '${post.dateIso}'`,
    'degreeStage: null',
    'subject: null',
    'frameOfMind:',
    '  emoji: null',
    '  description: null',
    `heroImg: ${post.heroImg ? JSON.stringify(post.heroImg) : 'null'}`,
    'handsOnTime: null',
    'handOffTime: null',
    'servings: null',
    'dietaryNotes: null',
    'storage: null',
    `author: ${AUTHOR_REF}`,
    'draft: false',
    '---',
    '',
  ];
  return lines.join('\n');
}

async function main() {
  ensureDir(UPLOADS_DIR);

  const existing = buildExistingIndex();
  console.log(`Existing post files: ${existing.filesCount}`);

  const entries = await fetchAllEntries();
  console.log(`Feed entries found: ${entries.length}`);

  const turndown = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
  });

  turndown.remove(['script', 'style']);

  const created = [];
  let skipped = 0;

  for (const entry of entries) {
    const title = entry?.title?.$t?.trim();
    const dateIso = entry?.published?.$t;
    const contentHtml = entry?.content?.$t;
    const altUrl = getAlternateUrl(entry);

    if (!title || !dateIso || !contentHtml) {
      skipped += 1;
      continue;
    }

    const remoteSlug = getRemoteSlugFromUrl(altUrl);
    const fileSlug = slugify(title);

    const titleNorm = normalizeText(title);
    const slugNorm = normalizeText(fileSlug.replace(/-/g, ' '));
    const remoteSlugNorm = normalizeText(remoteSlug.replace(/-/g, ' '));

    const alreadyExists =
      existing.titleSet.has(titleNorm) ||
      existing.slugSet.has(slugNorm) ||
      (remoteSlugNorm && existing.slugSet.has(remoteSlugNorm));

    if (alreadyExists && !FORCE) {
      skipped += 1;
      continue;
    }

    const outputName = `${fileSlug}.mdx`;
    const outputPath = path.join(POSTS_DIR, outputName);

    if (fs.existsSync(outputPath) && !FORCE) {
      skipped += 1;
      continue;
    }

    const cleanedHtml = stripInlineNoise(contentHtml);
    const localized = await localizeImages(cleanedHtml, fileSlug);
    const markdownBody = cleanMarkdown(turndown.turndown(localized.html));

    const fm = frontmatterFor({
      title,
      dateIso,
      heroImg: localized.heroImg,
    });

    const finalContent = `${fm}${markdownBody}\n`;

    if (!DRY_RUN) {
      fs.writeFileSync(outputPath, finalContent, 'utf8');
    }

    existing.titleSet.add(titleNorm);
    existing.slugSet.add(slugNorm);

    created.push({ title, outputName, imageCount: localized.imageCount, heroImg: localized.heroImg });
    console.log(`+ ${outputName} (${localized.imageCount} images)`);
  }

  console.log('');
  console.log(`Created: ${created.length}`);
  console.log(`Skipped: ${skipped}`);

  if (DRY_RUN && created.length > 0) {
    console.log('');
    console.log('Dry-run would create:');
    for (const item of created) {
      console.log(`  - ${item.outputName}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
