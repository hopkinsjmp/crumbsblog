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

  return (
    <LayoutProvider globalSettings={globalData.global} pageData={rawPageData}>
      <SidebarProvider>
        {/* Fixed sidebar — always visible on xl (≥1280 px), slide-in on mobile */}
        <Sidebar />

        {/* Main content area — shift right on desktop to clear the sidebar */}
        <div className="xl:ml-[284px]">
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
