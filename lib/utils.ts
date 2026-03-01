import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Prepends the Next.js basePath to local asset URLs for GitHub Pages deployment.
 * Only affects URLs that start with '/' and are not external URLs.
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
  
  // Only prepend basePath to absolute local paths that don't already include it
  if (url.startsWith('/') && !url.startsWith('/crumbsblog/')) {
    // The basePath is set in next.config.ts for GitHub Pages deployment
    const basePath = process.env.NODE_ENV === 'production' ? '/crumbsblog' : '';
    return `${basePath}${url}`;
  }
  
  return url;
}
