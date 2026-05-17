import React from 'react';
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import Layout from '@/components/layout/layout';
import PostClientPage from './client-page';

export const revalidate = 300;

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

  return (
    <Layout>
      <PostClientPage post={post} bodyHtml={bodyHtml} />
    </Layout>
  );
}

export async function generateStaticParams() {
  return getAllPosts(true).map((post) => ({
    urlSegments: [post.slug],
  }));
}
