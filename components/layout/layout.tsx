import React, { PropsWithChildren } from "react";
import { LayoutProvider } from "./layout-context";
import { SidebarProvider } from "./sidebar-context";
import client from "../../tina/__generated__/client";
import { Header } from "./nav/header";
import { Footer } from "./nav/footer";
import { Sidebar } from "./nav/sidebar";

type LayoutProps = PropsWithChildren & {
  rawPageData?: any;
};

export default async function Layout({ children, rawPageData }: LayoutProps) {
  const { data: globalData } = await client.queries.global({
    relativePath: "index.json",
  },
    {
      fetchOptions: {
        next: {
          revalidate: 60,
        },
      }
    }
  );

  // Fetch the 10 most recent non-draft posts for the "The Blog" nav dropdown
  let recentPosts: { title: string; url: string }[] = [];
  try {
    const { data: postsData } = await client.queries.postConnection({
      sort: 'date',
      last: 10,
    });
    recentPosts = (postsData.postConnection.edges ?? [])
      .filter((e) => e?.node && !e.node.draft)
      .map((e) => ({
        title: e!.node!.title,
        url: `/posts/${e!.node!._sys.breadcrumbs.join('/')}`,
      }))
      .reverse();
  } catch {
    // silently fall back to empty list
  }

  return (
    <LayoutProvider globalSettings={globalData.global} pageData={rawPageData} recentPosts={recentPosts}>
      <SidebarProvider>
        {/* Fixed sidebar — always visible on xl (≥1280 px), slide-in on mobile */}
        <Sidebar />

        {/* Main content — always full width; sidebar overlays from the left */}
        <div className="w-full">
          <Header />
          <main className="overflow-x-hidden">
            {children}
          </main>
          <Footer />
        </div>
      </SidebarProvider>
    </LayoutProvider>
  );
}
