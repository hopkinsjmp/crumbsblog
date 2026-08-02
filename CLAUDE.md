# CLAUDE.md

> **Note**: For general development guidelines and architecture patterns, see [`.github/copilot-instructions.md`](.github/copilot-instructions.md). This file focuses specifically on the publishing workflow.

## Publishing Playbook

This file is the source of truth for how publishing works in this repository.

### Core Rule

A post is considered published when all of the following are true:

1. The post has a `date` frontmatter field.
2. The `date` value parses as a valid date.
3. The parsed date is less than or equal to the current server time.

If any of those checks fail, the post is not published.

### Deprecated Field

The `draft` field is removed from the content model and is no longer used for visibility.
Do not add `draft` to new posts.

### Required Frontmatter

For posts in `content/posts/*.mdx`:

1. `title`: non-empty string
2. `date`: valid ISO-compatible date string

Other fields are optional.

## Visibility Matrix

### Home, posts index, nav, sitemap

These surfaces only show published posts:

1. `/`
2. `/posts`
3. Navigation recent posts dropdown
4. `sitemap.xml`

### Direct post URL

Direct post routes are strictly gated.
If a post is unpublished (missing/invalid/future date), `/posts/<slug>` returns 404.

## Deployment and Publish Timing

This site is deployed as a static export to GitHub Pages.

### What makes a post visible

A post becomes visible after a GitHub Pages build/deploy runs with a publishable date.

### Triggers

1. Push to `main` (immediate build path)
2. Manual run via `workflow_dispatch`
3. Scheduled build once daily at 10:00 UTC for auto-publishing future-dated posts

Notes:

1. Publishing from Sveltia CMS still follows the push trigger path when it commits to `main`.
2. The scheduled run is a safety net for time-based publishing without a new commit.

### Expected latency

1. Push/manual path: CI build plus deployment time
2. Scheduled path: up to about 24 hours plus deployment time

## Fast Publish Runbook

1. Ensure post frontmatter includes a valid publishable `date`.
2. Merge to `main` (or trigger manual deploy workflow).
3. Wait for the deploy workflow to finish.
4. Validate on `/posts` and the direct post URL.

## Troubleshooting: Post Not Visible

Check these in order:

1. `date` exists and is valid in frontmatter.
2. `date` is not in the future relative to UTC/server time.
3. Deploy workflow ran after the content change.
4. Deploy workflow completed successfully.
5. URL slug matches the post filename.

## Contributor Notes

1. Keep publishing logic date-based only.
2. Do not reintroduce `draft`-based gating.
3. Keep comments and docs aligned with runtime behavior.
