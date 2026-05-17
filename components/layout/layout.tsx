import React, { PropsWithChildren } from "react";
import { LayoutProvider } from "./layout-context";
import { SidebarProvider } from "./sidebar-context";
import { getGlobalSettings } from "@/lib/global";
import { getAllPosts } from "@/lib/posts";
import { Header } from "./nav/header";
import { Footer } from "./nav/footer";
import { Sidebar } from "./nav/sidebar";

type LayoutProps = PropsWithChildren & {
  rawPageData?: any;
};

export default async function Layout({ children, rawPageData }: LayoutProps) {
  const globalData = getGlobalSettings();

  // Fetch the 30 most recent non-draft posts for the "The Blog" nav dropdown
  const recentPosts = getAllPosts()
    .slice(0, 30)
    .map((p) => ({
      title: p.title,
      url: `/posts/${p.slug}`,
      heroImg: p.heroImg ?? null,
    }));

  return (
    <LayoutProvider globalSettings={globalData} pageData={rawPageData} recentPosts={recentPosts}>
      <SidebarProvider>
        {/* Fixed sidebar - always visible on xl (>=1280 px), slide-in on mobile */}
        <Sidebar />

        {/* Main content - always full width; sidebar overlays from the left */}
        <div className="w-full">
          <Header />
          <main>
            {children}
          </main>
          <Footer />
        </div>
      </SidebarProvider>
    </LayoutProvider>
  );
}
