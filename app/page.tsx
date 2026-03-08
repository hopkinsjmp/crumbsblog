import React, { Suspense } from "react";
import client from "@/tina/__generated__/client";
import Layout from "@/components/layout/layout";
import PostsClientPage from "./posts/client-page";

export const revalidate = 300;

export default async function Home() {
  let posts = await client.queries.postConnection({
    sort: 'date',
    last: 1,
  });
  const allPosts = posts;

  if (allPosts.data.postConnection.edges) {
    while (posts.data?.postConnection.pageInfo.hasPreviousPage) {
      posts = await client.queries.postConnection({
        sort: 'date',
        before: posts.data.postConnection.pageInfo.endCursor,
      });
      if (!posts.data.postConnection.edges) break;
      allPosts.data.postConnection.edges.push(
        ...posts.data.postConnection.edges.reverse()
      );
    }
  }

  const filteredEdges = allPosts.data.postConnection.edges?.filter(
    (edge) => edge && !edge.node?.draft 
  ) || [];

  return (
    <Layout rawPageData={{
        ...allPosts.data,
        postConnection: { ...allPosts.data.postConnection, edges: filteredEdges }
    }}>
      <Suspense fallback={<div className="mx-auto max-w-[960px] px-6 py-6 font-sans text-sm text-[#2c1d14]/50">Loading posts…</div>}>
        <PostsClientPage {...allPosts} data={{ ...allPosts.data, postConnection: { ...allPosts.data.postConnection, edges: filteredEdges } }} />
      </Suspense>
    </Layout>
  );
}
