import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');
const AUTHORS_DIR = path.join(process.cwd(), 'content/authors');
const TAGS_DIR = path.join(process.cwd(), 'content/tags');

export interface Author {
  name: string;
  avatar?: string | null;
}

export interface FrameOfMind {
  emoji?: string | null;
  description?: string | null;
}

export interface PostSummary {
  slug: string;
  title: string;
  date?: string | null;
  heroImg?: string | null;
  excerpt?: string | null;
  author?: Author | null;
  tags: string[];
  subject?: string | null;
  degreeStage?: string | null;
}

export interface Post extends PostSummary {
  heroImgCaption?: string | null;
  videoUrl?: string | null;
  frameOfMind?: FrameOfMind | null;
  handsOnTime?: string | null;
  handOffTime?: string | null;
  servings?: number | null;
  dietaryNotes?: string | null;
  ingredients?: string | null;
  method?: string | null;
  storage?: string | null;
  body: string;
}

function resolveAuthor(authorRef: string | null | undefined): Author | null {
  if (!authorRef) return null;

  if (authorRef.startsWith('content/')) {
    // TinaCMS format: "content/authors/Carmel.md"
    try {
      const fullPath = path.join(process.cwd(), authorRef);
      const raw = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(raw);
      return {
        name: data.name || path.basename(authorRef, path.extname(authorRef)),
        avatar: data.avatar || null,
      };
    } catch {
      return null;
    }
  }

  // Sveltia format: just the author name (e.g., "Carmel")
  try {
    const files = fs.readdirSync(AUTHORS_DIR);
    for (const file of files) {
      const slug = file.replace(/\.(md|mdx)$/, '');
      const fullPath = path.join(AUTHORS_DIR, file);
      const raw = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(raw);
      const name = data.name || slug;
      if (name.toLowerCase() === authorRef.toLowerCase() || slug.toLowerCase() === authorRef.toLowerCase()) {
        return { name, avatar: data.avatar || null };
      }
    }
  } catch {}

  return { name: authorRef, avatar: null };
}

function resolveTag(tagRef: string | null | undefined): string | null {
  if (!tagRef) return null;

  if (tagRef.includes('/')) {
    // TinaCMS format: "content/tags/recipe.mdx"
    try {
      const fullPath = path.join(process.cwd(), tagRef);
      const raw = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(raw);
      return data.name || path.basename(tagRef, path.extname(tagRef));
    } catch {
      return null;
    }
  }

  // Sveltia format: just the slug or name (e.g., "recipe")
  for (const ext of ['.mdx', '.md']) {
    try {
      const fullPath = path.join(TAGS_DIR, `${tagRef}${ext}`);
      if (fs.existsSync(fullPath)) {
        const raw = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(raw);
        return data.name || tagRef;
      }
    } catch {}
  }

  return tagRef;
}

function parseTags(tagsData: unknown): string[] {
  if (!Array.isArray(tagsData)) return [];
  return tagsData
    .map((t) => {
      if (typeof t === 'string') return resolveTag(t);
      if (t && typeof t === 'object' && 'tag' in t && typeof (t as { tag: unknown }).tag === 'string') {
        return resolveTag((t as { tag: string }).tag);
      }
      return null;
    })
    .filter((name): name is string => !!name);
}

export function getAllPosts(includeDrafts = false): PostSummary[] {
  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));

  const posts: PostSummary[] = files.map((filename) => {
    const slug = filename.replace(/\.(mdx?)$/, '').replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf8');
    const { data } = matter(raw);
    return {
      slug,
      title: data.title || slug,
      date: data.date ? String(data.date) : null,
      heroImg: data.heroImg || null,
      excerpt: data.excerpt || null,
      author: resolveAuthor(data.author),
      tags: parseTags(data.tags),
      subject: data.subject || null,
      degreeStage: data.degreeStage || null,
    };
  });

  const now = new Date();
  const filtered = includeDrafts
    ? posts
    : posts.filter((p) => p.date && new Date(p.date) <= now);

  return filtered.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function getPostBySlug(slug: string): Post | null {
  for (const ext of ['.mdx', '.md']) {
    const filepath = path.join(POSTS_DIR, `${slug}${ext}`);
    if (!fs.existsSync(filepath)) continue;

    const raw = fs.readFileSync(filepath, 'utf8');
    const { data, content } = matter(raw);

    return {
      slug,
      title: data.title || slug,
      date: data.date ? String(data.date) : null,
      heroImg: data.heroImg || null,
      excerpt: data.excerpt || null,
      author: resolveAuthor(data.author),
      tags: parseTags(data.tags),
      subject: data.subject || null,
      degreeStage: data.degreeStage || null,
      heroImgCaption: data.heroImgCaption || null,
      videoUrl: data.videoUrl || null,
      frameOfMind: data.frameOfMind || null,
      handsOnTime: data.handsOnTime || null,
      handOffTime: data.handOffTime || null,
      servings: typeof data.servings === 'number' ? data.servings : null,
      dietaryNotes: data.dietaryNotes || null,
      ingredients: data.ingredients || null,
      method: data.method || null,
      storage: data.storage || null,
      body: content,
    };
  }

  return null;
}
