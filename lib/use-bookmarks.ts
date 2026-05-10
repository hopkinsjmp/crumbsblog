"use client";
import { useState, useEffect, useCallback } from "react";

export interface Bookmark {
  url: string;
  title: string;
  heroImg?: string | null;
  date?: string | null;
}

const KEY = "crumbs_bookmarks";
const CHANGE_EVENT = "crumbs_bookmarks_changed";

function load(): Bookmark[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function save(bookmarks: Bookmark[]) {
  localStorage.setItem(KEY, JSON.stringify(bookmarks));
  // Notify all other useBookmarks instances in the same tab
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // Hydrate from localStorage after mount, and re-sync on any change
  useEffect(() => {
    setBookmarks(load());
    const sync = () => setBookmarks(load());
    window.addEventListener(CHANGE_EVENT, sync);
    return () => window.removeEventListener(CHANGE_EVENT, sync);
  }, []);

  const isBookmarked = useCallback(
    (url: string) => bookmarks.some((b) => b.url === url),
    [bookmarks]
  );

  const toggle = useCallback((bookmark: Bookmark) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.url === bookmark.url);
      const next = exists
        ? prev.filter((b) => b.url !== bookmark.url)
        : [bookmark, ...prev];
      save(next);
      return next;
    });
  }, []);

  const remove = useCallback((url: string) => {
    setBookmarks((prev) => {
      const next = prev.filter((b) => b.url !== url);
      save(next);
      return next;
    });
  }, []);

  return { bookmarks, isBookmarked, toggle, remove };
}
