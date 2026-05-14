/**
 * Redirect map tests
 *
 * Ensures every Blogger URL in BLOGGER_REDIRECTS maps to a valid-looking
 * internal path, so no visitor gets silently sent to a broken URL.
 */

import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

// Pull the redirect map out of not-found.tsx by reading the file and
// extracting the object literal — avoids needing to import a "use client"
// React component in a Node test environment.
function extractRedirectMap(): Record<string, string> {
  const src = fs.readFileSync(
    path.resolve(__dirname, "../app/not-found.tsx"),
    "utf8"
  );
  const match = src.match(
    /const BLOGGER_REDIRECTS[^=]*=\s*(\{[\s\S]*?\});/
  );
  if (!match) throw new Error("Could not find BLOGGER_REDIRECTS in not-found.tsx");
  // Safe eval of a plain object literal (no executable code)
  // eslint-disable-next-line no-new-func
  return new Function(`return ${match[1]}`)() as Record<string, string>;
}

const redirects = extractRedirectMap();
const entries = Object.entries(redirects);

describe("BLOGGER_REDIRECTS", () => {
  it("has at least one entry", () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  it.each(entries)(
    '"%s" → destination is a non-empty string starting with /posts/',
    (_from, to) => {
      expect(typeof to).toBe("string");
      expect(to.length).toBeGreaterThan(0);
      expect(to).toMatch(/^\/posts\//);
    }
  );

  it.each(entries)(
    '"%s" → source key looks like a Blogger path (YYYY/MM/slug.html)',
    (from) => {
      expect(from).toMatch(/^\d{4}\/\d{2}\/.+\.html$/);
    }
  );

  it("has no duplicate destination paths", () => {
    const destinations = entries.map(([, to]) => to);
    const unique = new Set(destinations);
    // Find any duplicates for a useful error message
    const duplicates = destinations.filter(
      (d, i) => destinations.indexOf(d) !== i
    );
    expect(duplicates).toEqual([]);
    expect(unique.size).toBe(destinations.length);
  });

  it("has no duplicate source keys", () => {
    const keys = entries.map(([from]) => from);
    const duplicates = keys.filter((k, i) => keys.indexOf(k) !== i);
    expect(duplicates).toEqual([]);
  });
});
