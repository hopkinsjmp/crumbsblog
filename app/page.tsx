import React from "react";
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

  return (
    <Layout rawPageData={allPosts.data}>
      <PostsClientPage {...allPosts} />
    </Layout>
  );
}
