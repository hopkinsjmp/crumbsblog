import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns true if a TinaCMS rich-text field has any actual content.
 * An empty rich-text field comes back as a root node with a single empty
 * paragraph rather than null, so a plain truthiness check isn't enough.
 */
export function hasRichTextContent(field: unknown): boolean {
  if (!field) return false;
  const root = field as { children?: { children?: { text?: string }[] }[] };
  if (!root.children?.length) return false;
  return root.children.some((block) =>
    block.children?.some((inline) => (inline.text ?? '').trim() !== '')
  );
}

/**
 * Prepends the Next.js basePath to local asset URLs for GitHub Pages deployment.
 * next/image with unoptimized:true does NOT automatically prepend basePath, so we
 * must do it manually here. NEXT_PUBLIC_BASE_PATH is set to '/crumbsblog' during
 * the static export build and '' locally.
 *
 * @param url - The URL to process (e.g., '/uploads/image.jpg')
 * @returns The URL with basePath prepended if applicable (e.g., '/crumbsblog/uploads/image.jpg')
 */
export function withBasePath(url: string | undefined | null): string {
  if (!url) return '';

  // Don't modify external URLs or data URLs
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }

  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  // Avoid double-prefixing if somehow already prefixed
  if (base && url.startsWith(base + '/')) return url;
  return base + url;
}
