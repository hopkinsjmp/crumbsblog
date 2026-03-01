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

  return (
    <ErrorBoundary>
      <div className="mx-auto max-w-[922px] px-6 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={post.url}
              className="group flex flex-col overflow-hidden rounded-lg bg-[#f7f4ef] shadow-md transition-shadow duration-200 hover:shadow-lg no-underline"
            >
              {/* Hero image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#e8e4db]">
                {post.heroImg ? (
                  <Image
                    src={withBasePath(post.heroImg)}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    unoptimized
                  />
                ) : (
                  /* Placeholder when no hero image */
                  <div className="flex h-full items-center justify-center">
                    <span className="font-heading text-5xl text-[#2c1d14]/20">
                      🍞
                    </span>
                  </div>
                )}
              </div>

              {/* Card body */}
              <div className="flex flex-1 flex-col p-5">
                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-sans text-[10px] uppercase tracking-widest text-[#a93e33]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h2 className="mb-3 font-heading text-xl font-normal leading-snug text-[#2c1d14] group-hover:underline">
                  {post.title}
                </h2>

                {/* Excerpt */}
                {post.excerpt && (
                  <div className="mb-4 line-clamp-3 font-serif text-sm leading-relaxed text-[#2c1d14]/70">
                    <TinaMarkdown content={post.excerpt} />
                  </div>
                )}

                {/* Footer — author + date pushed to bottom */}
                <div className="mt-auto flex items-center gap-2 font-sans text-xs text-[#2c1d14]/50">
                  {post.author.avatar ? (
                    <Image
                      src={withBasePath(post.author.avatar)}
                      alt={post.author.name}
                      width={20}
                      height={20}
                      className="rounded-full object-cover"
                      unoptimized
                    />
                  ) : null}
                  <span>{post.author.name}</span>
                  {post.published && (
                    <>
                      <span>·</span>
                      <span>{post.published}</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}
