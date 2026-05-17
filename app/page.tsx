import React, { Suspense } from "react";
import { getAllPosts } from "@/lib/posts";
import Layout from "@/components/layout/layout";
import PostsClientPage from "./posts/client-page";

export const revalidate = 300;

export default async function Home() {
  const posts = getAllPosts();

  return (
    <Layout>
      <Suspense fallback={<div className="mx-auto max-w-[960px] px-6 py-6 font-sans text-sm text-[#2c1d14]/50">Loading posts…</div>}>
        <PostsClientPage posts={posts} />
      </Suspense>
    </Layout>
  );
}
