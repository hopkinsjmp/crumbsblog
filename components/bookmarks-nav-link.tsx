"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBookmarks } from "@/lib/use-bookmarks";

export function BookmarksNavLink() {
  const pathname = usePathname();
  const { bookmarks } = useBookmarks();
  const count = bookmarks.length;
  const active = pathname?.startsWith("/bookmarks");

  return (
    <Link
      href="/bookmarks"
      className={`font-sans text-sm font-normal uppercase tracking-wider transition-colors duration-150 m-0 p-0
        ${active ? "text-[#2c1d14] underline underline-offset-4 decoration-[#2c1d14]" : "text-[#2c1d14]/80 hover:text-[#2c1d14]"}
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c1d14]/40`}
      aria-current={active ? "page" : undefined}
    >
      Bookmarks{count > 0 ? ` (${count})` : ""}
    </Link>
  );
}
