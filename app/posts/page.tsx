import { Suspense } from 'react';
import Layout from '@/components/layout/layout';
import { getAllPosts } from '@/lib/posts';
import PostsClientPage from './client-page';

export const revalidate = 300;

export default async function PostsPage() {
  const posts = getAllPosts();

  return (
    <Layout>
      <Suspense fallback={<div className="mx-auto max-w-[922px] px-6 py-10 font-sans text-sm text-[#2c1d14]/50">Loading posts…</div>}>
        <PostsClientPage posts={posts} />
      </Suspense>
    </Layout>
  );
}
