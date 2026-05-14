/**
 * Slug uniqueness tests
 *
 * Ensures no two posts share the same filename (slug), which would cause
 * one post to silently overwrite the other in the static build output.
 */

import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const POSTS_DIR = path.resolve(__dirname, "../content/posts");

function getPostSlugs(): string[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.(mdx|md)$/, ""));
}

describe("Post slugs", () => {
  const slugs = getPostSlugs();

  it("finds at least one post", () => {
    expect(slugs.length).toBeGreaterThan(0);
  });

  it("has no duplicate slugs (case-insensitive)", () => {
    const lower = slugs.map((s) => s.toLowerCase());
    const duplicates = lower.filter((s, i) => lower.indexOf(s) !== i);
    expect(duplicates).toEqual([]);
  });

  it("has no slugs with spaces (would break URLs)", () => {
    const withSpaces = slugs.filter((s) => s.includes(" "));
    expect(withSpaces).toEqual([]);
  });
});
