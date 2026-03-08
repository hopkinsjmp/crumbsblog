"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function SearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  // Keep input in sync if the URL param changes (e.g. browser back/forward)
  useEffect(() => {
    setValue(searchParams.get("q") ?? "");
  }, [searchParams]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      router.push(`/posts?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/posts");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <label htmlFor="sidebar-search" className="sr-only">
        Search posts
      </label>
      <input
        id="sidebar-search"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search posts…"
        className="min-w-0 flex-1 rounded border border-[#2c1d14]/30 bg-white px-3 py-1.5 font-sans text-sm text-[#2c1d14] placeholder:text-[#2c1d14]/40 focus:border-[#a93e33] focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Submit search"
        className="flex items-center justify-center rounded bg-[#a93e33] px-3 py-1.5 text-white hover:bg-[#7a2d24] transition-colors"
      >
        {/* magnifying glass icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </form>
  );
}
