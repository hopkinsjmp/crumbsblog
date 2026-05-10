"use client";
import React, { useState } from "react";
import { useBookmarks, type Bookmark } from "@/lib/use-bookmarks";

interface PostActionsProps {
  bookmark: Bookmark;
  shareTitle: string;
  shareUrl: string;
}

export function PostActions({ bookmark, shareTitle, shareUrl }: PostActionsProps) {
  const { isBookmarked, toggle, bookmarks } = useBookmarks();
  const saved = isBookmarked(bookmark.url);
  const [shareLabel, setShareLabel] = useState<"Share" | "Copied!">("Share");

  async function handleShare() {
    const url = typeof window !== "undefined"
      ? window.location.origin + shareUrl
      : shareUrl;

    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url });
      } catch {
        // user cancelled - do nothing
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setShareLabel("Copied!");
        setTimeout(() => setShareLabel("Share"), 2000);
      } catch {
        // fallback: select a temporary input
        const el = document.createElement("input");
        el.value = url;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setShareLabel("Copied!");
        setTimeout(() => setShareLabel("Share"), 2000);
      }
    }
  }

  return (
    <>
      {/* Bookmark */}
      <button
        onClick={() => toggle(bookmark)}
        aria-label={saved ? "Remove bookmark" : "Bookmark this post"}
        title={saved ? "Remove bookmark" : "Save to bookmarks"}
        className={`flex items-center gap-1.5 px-4 py-2.5 font-sans text-sm font-medium transition-colors border-b-2 -mb-px focus:outline-none ${
          saved
            ? "border-[#a93e33] text-[#a93e33]"
            : "border-transparent text-[#2c1d14]/50 hover:text-[#2c1d14]"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={saved ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-4 w-4 shrink-0"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 3a2 2 0 0 0-2 2v13l7-3 7 3V5a2 2 0 0 0-2-2H5Z"
          />
        </svg>
        {saved ? "Bookmarked" : "Bookmark"}
      </button>

      {/* Share */}
      <button
        onClick={handleShare}
        aria-label="Share this post"
        title="Share or copy link"
        className="flex items-center gap-1.5 px-4 py-2.5 font-sans text-sm font-medium transition-colors border-b-2 border-transparent -mb-px text-[#2c1d14]/50 hover:text-[#2c1d14] focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-4 w-4 shrink-0"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 6.5 10 3m0 0L6.5 6.5M10 3v10m-6 4h12"
          />
        </svg>
        {shareLabel}
      </button>
    </>
  );
}
