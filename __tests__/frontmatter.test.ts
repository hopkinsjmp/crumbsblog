/**
 * Frontmatter validation tests
 *
 * Reads every .mdx post and asserts that required fields are present
 * and well-formed, catching content mistakes before they reach production.
 */

import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.resolve(__dirname, "../content/posts");

interface PostFrontmatter {
  title?: unknown;
  date?: unknown;
  heroImg?: unknown;
  [key: string]: unknown;
}

function getPostFiles(): Array<{ file: string; data: PostFrontmatter }> {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, f), "utf8");
      const { data } = matter(raw);
      return { file: f, data: data as PostFrontmatter };
    });
}

const posts = getPostFiles();

describe("Post frontmatter", () => {
  it("finds at least one post", () => {
    expect(posts.length).toBeGreaterThan(0);
  });

  describe.each(posts)("$file", ({ file, data }) => {
    it("has a non-empty title", () => {
      expect(data.title, `${file}: missing title`).toBeTruthy();
      expect(typeof data.title).toBe("string");
      expect((data.title as string).trim().length).toBeGreaterThan(0);
    });

    it("has a valid ISO date", () => {
      expect(data.date, `${file}: missing date`).toBeTruthy();
      const d = new Date(data.date as string);
      expect(isNaN(d.getTime()), `${file}: date is not a valid date`).toBe(false);
    });

    it("heroImg, if present, is a valid path starting with /", () => {
      if (!data.heroImg) {
        // Not required — some posts are intentionally imageless — but log so it's visible
        console.warn(`⚠  ${file}: no heroImg set`);
        return;
      }
      expect(typeof data.heroImg).toBe("string");
      expect((data.heroImg as string).startsWith("/")).toBe(true);
    });
  });
});
