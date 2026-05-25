import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { marked } from 'marked';
import { getAllPosts, getPostBySlug, getSeoDescription } from '@/lib/posts';
import Layout from '@/components/layout/layout';
import PostClientPage from './client-page';

export const revalidate = 300;

/** Convert a plain-English duration string like "50 minutes" or "1 hour 30 minutes"
 *  into an ISO 8601 duration (PT50M / PT1H30M). Returns undefined if unparseable. */
function toIsoDuration(raw: string | null | undefined): string | undefined {
  if (!raw) return undefined;
  const s = raw.toLowerCase();
  const hours = s.match(/(\d+)\s*h/);
  const mins = s.match(/(\d+)\s*m/);
  const h = hours ? parseInt(hours[1]) : 0;
  const m = mins ? parseInt(mins[1]) : 0;
  if (!h && !m) return undefined;
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ urlSegments: string[] }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.urlSegments.join('/');
  const post = getPostBySlug(slug);
  if (!post) return {};

  const description = getSeoDescription(post);
  const ogImage = post.heroImg
    ? [{ url: post.heroImg, width: 1200, height: 630, alt: post.title }]
    : undefined;

  return {
    title: post.title,
    description: description || undefined,
    openGraph: {
      title: post.title,
      description: description || undefined,
      type: 'article',
      publishedTime: post.date ?? undefined,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: ogImage,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: description || undefined,
      images: ogImage?.map((i) => i.url),
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ urlSegments: string[] }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.urlSegments.join('/');
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const bodyHtml = await marked(post.body ?? '');

  // Build Recipe JSON-LD for schema.org rich results
  const recipeJsonLd = post.ingredients
    ? {
        '@context': 'https://schema.org',
        '@type': 'Recipe',
        name: post.title,
        description: getSeoDescription(post) || undefined,
        image: post.heroImg ? [`https://crumbsofsanity.com${post.heroImg}`] : undefined,
        author: post.author?.name
          ? { '@type': 'Person', name: post.author.name }
          : undefined,
        datePublished: post.date ?? undefined,
        prepTime: toIsoDuration(post.handsOnTime),
        cookTime: toIsoDuration(post.handOffTime),
        recipeYield: post.servings ? String(post.servings) : undefined,
        recipeIngredient: post.ingredients
          .split('\n')
          .map((l) => l.replace(/^\s*[\*\-]\s*/, '').trim())
          .filter(Boolean),
        recipeInstructions: post.method
          ? post.method
              .split('\n')
              .filter((l) => /^\s*\d+\./.test(l))
              .map((l, i) => ({
                '@type': 'HowToStep',
                position: i + 1,
                text: l.replace(/^\s*\d+\.\s*/, '').trim(),
              }))
          : undefined,
      }
    : null;

  return (
    <Layout>
      {recipeJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeJsonLd) }}
        />
      )}
      <PostClientPage post={post} bodyHtml={bodyHtml} />
    </Layout>
  );
}

export async function generateStaticParams() {
  return getAllPosts(true).map((post) => ({
    urlSegments: [post.slug],
  }));
}

