"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useBookmarks } from "@/lib/use-bookmarks";
import PageContainer from "@/components/layout/page-container";
import { withBasePath } from "@/lib/utils";

export default function BookmarksClientPage() {
  const { bookmarks, remove } = useBookmarks();

  return (
    <PageContainer>
      <h1 className="mb-6 font-heading text-4xl font-normal text-[#2c1d14]">
        Saved Posts
      </h1>

      {bookmarks.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-serif text-lg text-[#2c1d14]/50">
            You haven't saved anything yet.
          </p>
          <Link
            href="/posts"
            className="mt-4 inline-block font-sans text-sm text-[#a93e33] hover:underline"
          >
            Browse all posts →
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-[#2c1d14]/10 rounded-lg border border-[#2c1d14]/10 bg-[#f7f4ef] overflow-hidden">
          {bookmarks.map((b) => (
            <div
              key={b.url}
              className="flex items-center gap-3 px-3 py-2.5"
            >
              {/* Thumbnail */}
              <Link href={b.url} className="shrink-0 no-underline">
                <div className="w-12 h-12 rounded overflow-hidden bg-[#e8e4db]">
                  {b.heroImg ? (
                    <Image
                      src={withBasePath(b.heroImg)}
                      alt=""
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#2c1d14]/20 text-sm">
                      ✦
                    </div>
                  )}
                </div>
              </Link>

              {/* Title */}
              <Link
                href={b.url}
                className="flex-1 font-sans text-sm text-[#2c1d14] hover:text-[#a93e33] no-underline line-clamp-2"
              >
                {b.title}
              </Link>

              {/* Remove */}
              <button
                onClick={() => remove(b.url)}
                aria-label="Remove bookmark"
                title="Remove"
                className="shrink-0 text-[#2c1d14]/30 hover:text-[#a93e33] transition-colors p-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
