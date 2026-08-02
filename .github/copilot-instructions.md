# GitHub Copilot Instructions

> **Note**: This file covers general development guidelines, architecture, and CMS usage. For publishing workflow specifics (draft/published logic, date-based visibility), see [`CLAUDE.md`](../CLAUDE.md).

## Project Overview

This project uses **Sveltia CMS** as a Git-based headless CMS with **Next.js** for the frontend. It features a server/client split architecture for efficient data fetching and interactive UI components.

### Key Concepts
- **Sveltia CMS**: Git-based CMS with admin UI for managing markdown content
- **Git Workflow**: Draft/published workflow using Git branches
- **Markdown/MDX**: Content stored as `.mdx` files in `/content/posts/`
- **Server/Client split**: Fetch data on server, render interactive UI on client
- **No inline editing**: Content managed through `/admin` interface, not inline

## Technology Stack

- **Language**: TypeScript
- **Framework**: Next.js 14 (App Router)
- **CMS**: Sveltia CMS (Git-based)
- **UI Framework**: React
- **Styling**: Tailwind CSS
- **Content Format**: Markdown/MDX (`.mdx` files)
- **Package Manager**: pnpm

### Framework Notes
- **Next.js (App Router)**: Native server/client component split 
- Server components for data fetching
- Client components for interactivity

## Architecture

### Core Pattern: Server/Client Split

All pages follow this structure:

```
page/
├── page.tsx           # Server component; fetches data from markdown files
└── client-page.tsx    # Client component; renders UI with interactivity
```

#### Data Flow
1. **Server (`page.tsx`)**
   - Reads markdown files from `/content/posts/`
   - Parses frontmatter and content using `gray-matter` and `marked`
   - Passes parsed data to client component
   - Pure data fetching, no visual editing

2. **Client (`client-page.tsx`)**
   - Receives parsed post data as props
   - Renders interactive UI (tabs, bookmarks, share buttons)
   - Manages client-side state (active tab, etc.)
   - No CMS integration needed - just standard React

## Content Management

### Sveltia CMS

- **Access**: Navigate to `/admin` in your browser
- **Config**: `public/admin/config.yml`
- **Storage**: Content saved as `.mdx` files in `/content/posts/`
- **Workflow**: 
  - All content commits directly to `main` branch (no draft branches)
  - Click "Save" to commit changes
  - Publishing controlled by `date` field in frontmatter
- **Draft/Published Filter**:
  - Shows posts with past dates as "Published"
  - Shows posts with future/missing dates as "Drafts"
  - Filter is for organization only - actual visibility controlled by date logic
- **Authentication**: Git-based (GitHub, GitLab, etc.)

### Publishing Logic

Posts appear on the site when:
1. Post has a valid `date` in frontmatter
2. Date is less than or equal to current server time
3. See `CLAUDE.md` for detailed publishing rules

### Data Fetching Pattern

#### Reading Post Data

```typescript
// lib/posts.ts helper functions
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

export async function getPostBySlug(slug: string) {
  const filePath = path.join(process.cwd(), 'content/posts', `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const bodyHtml = await marked(content);
  
  return {
    ...data,
    bodyHtml,
    slug,
  };
}
```

## Framework-Specific Patterns

### Next.js (App Router)

#### Server Component (page.tsx)

```typescript
// app/posts/[...urlSegments]/page.tsx
import { getPostBySlug } from '@/lib/posts';
import ClientPage from './client-page';
import { notFound } from 'next/navigation';

interface PageProps {
  params: { urlSegments: string[] };
}

export default async function Page({ params }: PageProps) {
  const slug = params.urlSegments?.join('/');
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <ClientPage post={post} bodyHtml={post.bodyHtml} />;
}
```

#### Client Component (client-page.tsx)

```typescript
// app/posts/[...urlSegments]/client-page.tsx
"use client";

import { useState } from 'react';
import { Post } from '@/lib/posts';

interface ClientPageProps {
  post: Post;
  bodyHtml: string;
}

export default function ClientPage({ post, bodyHtml }: ClientPageProps) {
  const [activeTab, setActiveTab] = useState<'story' | 'recipe' | 'video'>('story');

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.excerpt}</p>
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </article>
  );
}
```

### Index/Archive Pages

#### Server Component (page.tsx)

```typescript
// app/posts/page.tsx
import { getAllPosts } from '@/lib/posts';
import ClientPage from './client-page';

export default async function PostsPage() {
  const posts = await getAllPosts();
  
  return <ClientPage posts={posts} />;
}
```

#### Client Component (client-page.tsx)

```typescript
// app/posts/client-page.tsx
"use client";

import Link from "next/link";
import { Post } from '@/lib/posts';

interface ClientPageProps {
  posts: Post[];
}

export default function ClientPage({ posts }: ClientPageProps) {
  return (
    <div>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/posts/${post.slug}`}>
              <h2>{post.title}</h2>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## TypeScript Best Practices

### Type Definitions

```typescript
// lib/posts.ts
export interface Post {
  title: string;
  date: string;
  author?: {
    name: string;
    avatar?: string;
  };
  excerpt?: string;
  heroImg?: string;
  heroImgCaption?: string;
  slug: string;
  bodyHtml?: string;
  // ... other fields from frontmatter
}
```

### Props Typing

```typescript
interface ClientPageProps {
  post: Post;
  bodyHtml: string;
}

export default function ClientPage({ post, bodyHtml }: ClientPageProps) {
  // Fully typed props
}
```

## Code Style and Patterns

### File Organization

```
app/
├── posts/
│   ├── [...urlSegments]/
│   │   ├── page.tsx           # Server component
│   │   └── client-page.tsx    # Client component
│   ├── page.tsx               # Index server
│   └── client-page.tsx        # Index client
components/
├── layout/
│   └── nav/
├── ui/
└── mdx-components.tsx
content/
├── posts/                     # Markdown files
├── authors/
└── pages/
lib/
├── posts.ts                   # Data fetching utilities
└── utils.ts
public/
├── admin/
│   └── config.yml             # Sveltia CMS config
└── uploads/                   # Images
```

### Naming Conventions

- **Files**: kebab-case (e.g., `client-page.tsx`, `mdx-components.tsx`)
- **Components**: PascalCase (e.g., `ClientPage`)
- **Functions**: camelCase (e.g., `getPostBySlug`)
- **Types/Interfaces**: PascalCase (e.g., `Post`, `ClientPageProps`)

### Component Structure

```typescript
"use client"; // Only in client components

import { useState } from 'react';
import { Post } from '@/lib/posts';

// Types/Interfaces
interface ComponentProps {
  post: Post;
}

// Constants (if any)
const TAB_OPTIONS = ['story', 'recipe', 'video'] as const;

// Main component
export default function Component({ post }: ComponentProps) {
  // State
  const [activeTab, setActiveTab] = useState('story');
  
  // Handlers
  function handleTabChange(tab: string) {
    setActiveTab(tab);
  }
  
  // Render
  return <div>{/* JSX */}</div>;
}
```

## Error Handling

### Server-Side (page.tsx)

```typescript
import { notFound } from "next/navigation";

export default async function Page({ params }: PageProps) {
  const slug = params.urlSegments?.join('/');
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <ClientPage post={post} bodyHtml={post.bodyHtml} />;
}
```

### Client-Side

```typescript
export default function ClientPage({ post, bodyHtml }: ClientPageProps) {
  // Data is guaranteed to be valid if passed from server
  // No need for loading/error states here
  
  return <article>{/* render post */}</article>;
}
```

## Development Workflow

### Before Making Changes

1. Check existing patterns in the codebase
2. Review this guide for architecture decisions
3. Ensure changes align with project goals

### Making Changes

1. Make minimal, surgical changes - change only what's necessary
2. Follow existing code patterns and conventions
3. Update documentation if making structural changes
4. Test changes locally before committing

### After Making Changes

1. ✅ Verify TypeScript compiles: `pnpm run build`
2. ✅ Test locally: `pnpm run dev`
3. ✅ Check responsive design on mobile
4. ✅ Verify images load correctly
5. ✅ Test navigation and links
6. ✅ Commit with clear messages

### Testing Checklist

- [ ] TypeScript compiles without errors
- [ ] Components render correctly
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Images load properly
- [ ] Links work correctly
- [ ] No console errors or warnings

## Patterns to Avoid

### ❌ Don't Do This

```typescript
// ❌ Fetching data in client component
"use client";
const data = await fetch('/api/posts'); // Use server component!

// ❌ Forgetting "use client" in client component
// If you use hooks or event handlers, you need "use client"
export default function ClientPage() {
  const [state, setState] = useState(); // Error without "use client"
}

// ❌ Using any types
const post: any = getPost(); // Loses type safety

// ❌ Hardcoding paths
const post = await getPostBySlug('fixed-slug'); // Not dynamic!
```

### ✅ Do This Instead

```typescript
// ✅ Fetch in server, render in client
// page.tsx (server)
const post = await getPostBySlug(slug);
return <ClientPage post={post} bodyHtml={post.bodyHtml} />;

// client-page.tsx (client)
"use client";
export default function ClientPage({ post, bodyHtml }: ClientPageProps) {
  // ... interactive UI
}

// ✅ Use proper TypeScript types
const post: Post = await getPostBySlug(slug);

// ✅ Pass dynamic paths
const slug = params.urlSegments?.join('/');
const post = await getPostBySlug(slug);
```

## Examples

### ✅ Good: Single Post Page

**page.tsx (Server)**
```typescript
import { getPostBySlug } from '@/lib/posts';
import ClientPage from './client-page';
import { notFound } from 'next/navigation';

interface PageProps {
  params: { urlSegments: string[] };
}

export default async function Page({ params }: PageProps) {
  const slug = params.urlSegments?.join('/');
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <ClientPage post={post} bodyHtml={post.bodyHtml} />;
}
```

**client-page.tsx (Client)**
```typescript
"use client";

import { useState } from 'react';
import { Post } from '@/lib/posts';

interface ClientPageProps {
  post: Post;
  bodyHtml: string;
}

export default function ClientPage({ post, bodyHtml }: ClientPageProps) {
  const [activeTab, setActiveTab] = useState<'story' | 'recipe' | 'video'>('story');

  return (
    <article>
      <h1>{post.title}</h1>
      {post.excerpt && <p className="excerpt">{post.excerpt}</p>}
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </article>
  );
}
```

## Checklist

Before completing a feature:

- [ ] Server component fetches data from markdown files
- [ ] Server component passes data to client component
- [ ] Client component has `"use client"` directive (if needed)
- [ ] Props properly typed with TypeScript interfaces
- [ ] Error handling implemented (404 for missing posts)
- [ ] Dynamic data passed (not hardcoded paths)
- [ ] Tested on mobile and desktop
- [ ] No console errors or TypeScript issues
- [ ] Code follows existing patterns

## Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Sveltia CMS**: https://github.com/sveltia/sveltia-cms
- **Tailwind CSS**: https://tailwindcss.com/docs
- **MDX**: https://mdxjs.com/

Check existing pages in this repo for patterns and examples.

---

**Last Updated**: 2026-08-02
**Language**: TypeScript
**CMS**: Sveltia CMS
**Framework**: Next.js 14
