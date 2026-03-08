'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { PostConnectionQuery, PostConnectionQueryVariables } from '@/tina/__generated__/types';
import ErrorBoundary from '@/components/error-boundary';
import { withBasePath } from '@/lib/utils';

interface ClientPostProps {
  data: PostConnectionQuery;
  variables: PostConnectionQueryVariables;
  query: string;
}

export default function PostsClientPage(props: ClientPostProps) {
  const posts = props.data?.postConnection.edges!.map((postData) => {
    const post = postData!.node!;
    const date = new Date(post.date!);
    let formattedDate = '';
    if (!isNaN(date.getTime())) {
      formattedDate = format(date, 'MMM dd, yyyy');
    }

    return {
      id: post.id,
      published: formattedDate,
      title: post.title,
      tags: post.tags?.map((tag) => tag?.tag?.name) || [],
      url: `/posts/${post._sys.breadcrumbs.join('/')}`,
      excerpt: post.excerpt,
      heroImg: post.heroImg,
      author: {
        name: post.author?.name || 'Anonymous',
        avatar: post.author?.avatar,
      },
    };
  });

  // ---- card renderers -------------------------------------------------------

  /** Shared card chrome — wraps any size variant */
  const PostCard = ({
    post,
    imgAspect = 'aspect-[4/3]',
    titleSize = 'text-xl',
    showExcerpt = false,
  }: {
    post: (typeof posts)[number];
    imgAspect?: string;
    titleSize?: string;
    showExcerpt?: boolean;
  }) => (
    <Link
      href={post.url}
      className="group flex flex-col overflow-hidden rounded-lg bg-[#f7f4ef] shadow-md transition-shadow duration-200 hover:shadow-lg no-underline h-full"
    >
      {/* Hero image */}
      <div className={`relative ${imgAspect} w-full overflow-hidden bg-[#e8e4db]`}>
        {post.heroImg ? (
          <Image
            src={withBasePath(post.heroImg)}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-heading text-5xl text-[#2c1d14]/20">🍞</span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="font-sans text-[10px] uppercase tracking-widest text-[#a93e33]">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className={`mb-3 font-heading ${titleSize} font-normal leading-snug text-[#2c1d14] group-hover:underline`}>
          {post.title}
        </h2>

        {/* Excerpt — only shown on featured / wide cards */}
        {showExcerpt && post.excerpt && (
          <div className="mb-4 line-clamp-3 font-serif text-sm leading-relaxed text-[#2c1d14]/70">
            <TinaMarkdown content={post.excerpt} />
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center gap-2 font-sans text-xs text-[#2c1d14]/50">
          {post.author.avatar && (
            <Image
              src={withBasePath(post.author.avatar)}
              alt={post.author.name}
              width={20}
              height={20}
              className="rounded-full object-cover"
              unoptimized
            />
          )}
          <span>{post.author.name}</span>
          {post.published && <><span>·</span><span>{post.published}</span></>}
        </div>
      </div>
    </Link>
  );

  // ---- layout ---------------------------------------------------------------

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <ErrorBoundary>
      <div className="mx-auto max-w-[922px] px-6 py-10 space-y-6">

        {/* ── Row 0: full-width featured post ── */}
        {featured && (
          <PostCard post={featured} imgAspect="aspect-[16/7]" titleSize="text-3xl" showExcerpt />
        )}

        {/* ── Remaining posts ── */}
        {rest.length > 0 && (() => {
          const rows: React.ReactNode[] = [];
          let i = 0;
          let rowIndex = 0;

          while (i < rest.length) {
            const remaining = rest.length - i;

            if (remaining === 1) {
              // Single leftover — full width
              rows.push(
                <div key={`row-${rowIndex}`}>
                  <PostCard post={rest[i]} imgAspect="aspect-[16/7]" titleSize="text-2xl" showExcerpt />
                </div>
              );
              i += 1;
            } else if (remaining === 2 || rowIndex % 3 === 0) {
              // Two equal columns
              rows.push(
                <div key={`row-${rowIndex}`} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <PostCard post={rest[i]}   imgAspect="aspect-[4/3]" titleSize="text-lg" />
                  <PostCard post={rest[i+1]} imgAspect="aspect-[4/3]" titleSize="text-lg" />
                </div>
              );
              i += 2;
            } else if (rowIndex % 3 === 1) {
              // Wide left (2/3) + narrow right (1/3)
              rows.push(
                <div key={`row-${rowIndex}`} className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <PostCard post={rest[i]}   imgAspect="aspect-[16/9]" titleSize="text-xl" showExcerpt />
                  </div>
                  <div className="sm:col-span-1">
                    <PostCard post={rest[i+1]} imgAspect="aspect-[4/3]"  titleSize="text-base" />
                  </div>
                </div>
              );
              i += 2;
            } else {
              // Narrow left (1/3) + wide right (2/3)
              rows.push(
                <div key={`row-${rowIndex}`} className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div className="sm:col-span-1">
                    <PostCard post={rest[i]}   imgAspect="aspect-[4/3]"  titleSize="text-base" />
                  </div>
                  <div className="sm:col-span-2">
                    <PostCard post={rest[i+1]} imgAspect="aspect-[16/9]" titleSize="text-xl" showExcerpt />
                  </div>
                </div>
              );
              i += 2;
            }

            rowIndex++;
          }

          return rows;
        })()}
      </div>
    </ErrorBoundary>
  );
}
