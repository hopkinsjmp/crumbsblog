'use client';
import React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { tinaField, useTina } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { PostQuery } from '@/tina/__generated__/types';
import { components } from '@/components/mdx-components';
import ErrorBoundary from '@/components/error-boundary';
import { withBasePath } from '@/lib/utils';

const titleColorClasses = {
  blue: 'from-blue-400 to-blue-600 dark:from-blue-300 dark:to-blue-500',
  teal: 'from-teal-400 to-teal-600 dark:from-teal-300 dark:to-teal-500',
  green: 'from-green-400 to-green-600',
  red: 'from-red-400 to-red-600',
  pink: 'from-pink-300 to-pink-500',
  purple: 'from-purple-400 to-purple-600 dark:from-purple-300 dark:to-purple-500',
  orange: 'from-orange-300 to-orange-600 dark:from-orange-200 dark:to-orange-500',
  yellow: 'from-yellow-400 to-yellow-500 dark:from-yellow-300 dark:to-yellow-500',
};

interface ClientPostProps {
  data: PostQuery;
  variables: {
    relativePath: string;
  };
  query: string;
}

export default function PostClientPage(props: ClientPostProps) {
  const { data } = useTina({ ...props });
  const post = data.post;

  const date = new Date(post.date!);
  const formattedDate = !isNaN(date.getTime()) ? format(date, 'MMMM d, yyyy') : '';

  return (
    <ErrorBoundary>
      <article className="mx-auto max-w-[720px] px-6 py-10">

        {/* ── Hero image ─────────────────────────────────────────────────── */}
        {post.heroImg && (
          <div
            data-tina-field={tinaField(post, 'heroImg')}
            className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-lg shadow-md"
          >
            <Image
              priority
              src={withBasePath(post.heroImg)}
              alt={post.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        {/* ── Title ──────────────────────────────────────────────────────── */}
        <h1
          data-tina-field={tinaField(post, 'title')}
          className="mb-4 font-heading text-4xl font-normal leading-tight text-[#2c1d14] md:text-5xl"
        >
          {post.title}
        </h1>

        {/* ── Metadata row: degreeStage, subject, frameOfMind ──────────────── */}
        {(post.degreeStage || post.subject || post.frameOfMind) && (
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-[#2c1d14]/70">
            {post.degreeStage && (
              <span
                data-tina-field={tinaField(post, 'degreeStage')}
                className="rounded-full bg-[#2c1d14]/5 px-3 py-1"
              >
                {post.degreeStage}
              </span>
            )}
            {post.subject && (
              <span
                data-tina-field={tinaField(post, 'subject')}
                className="rounded-full bg-[#2c1d14]/5 px-3 py-1"
              >
                {post.subject}
              </span>
            )}
            {post.frameOfMind && (
              <span
                data-tina-field={tinaField(post, 'frameOfMind')}
                className="flex items-center gap-2 rounded-full bg-[#2c1d14]/5 px-3 py-1"
              >
                {post.frameOfMind.emoji && (
                  <span data-tina-field={tinaField(post.frameOfMind, 'emoji')}>
                    {post.frameOfMind.emoji}
                  </span>
                )}
                {post.frameOfMind.description && (
                  <span data-tina-field={tinaField(post.frameOfMind, 'description')}>
                    {post.frameOfMind.description}
                  </span>
                )}
              </span>
            )}
          </div>
        )}

        {/* ── Excerpt ────────────────────────────────────────────────────── */}
        {post.excerpt && (
          <div
            data-tina-field={tinaField(post, 'excerpt')}
            className="mb-4 font-serif text-lg italic leading-relaxed text-[#2c1d14]/80"
          >
            <TinaMarkdown content={post.excerpt} />
          </div>
        )}

        {/* ── Servings & Dietary Notes ───────────────────────────────────── */}
        {(post.servings || post.dietaryNotes) && (
          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-[#2c1d14]/70">
            {post.servings && (
              <span data-tina-field={tinaField(post, 'servings')}>
                <strong className="text-[#2c1d14]">Servings:</strong> {post.servings}
              </span>
            )}
            {post.dietaryNotes && (
              <span data-tina-field={tinaField(post, 'dietaryNotes')}>
                <strong className="text-[#2c1d14]">Dietary Notes:</strong> {post.dietaryNotes}
              </span>
            )}
          </div>
        )}

        {/* ── Time ───────────────────────────────────────────────────────── */}
        {(post.handsOnTime || post.handOffTime) && (
          <div className="mb-6 text-sm text-[#2c1d14]/70">
            <strong className="text-[#2c1d14]">Time:</strong>
            {post.handsOnTime && (
              <div data-tina-field={tinaField(post, 'handsOnTime')} className="ml-4">
                Hands-on: {post.handsOnTime}
              </div>
            )}
            {post.handOffTime && (
              <div data-tina-field={tinaField(post, 'handOffTime')} className="ml-4">
                Hands-off: {post.handOffTime}
              </div>
            )}
          </div>
        )}

        {/* ── Author + date byline ────────────────────────────────────────── */}
        <div
          data-tina-field={tinaField(post, 'author')}
          className="mb-8 flex items-center gap-3 border-b border-[#2c1d14]/15 pb-6"
        >
          {post.author?.avatar && (
            <Image
              data-tina-field={tinaField(post.author, 'avatar')}
              src={withBasePath(post.author.avatar)}
              alt={post.author.name ?? ''}
              width={40}
              height={40}
              className="rounded-full object-cover"
              unoptimized
            />
          )}
          <div className="font-sans text-sm text-[#2c1d14]/70">
            {post.author?.name && (
              <span
                data-tina-field={tinaField(post.author, 'name')}
                className="font-semibold text-[#2c1d14]"
              >
                By {post.author.name}
              </span>
            )}
            {post.author?.name && formattedDate && (
              <span className="mx-2 text-[#2c1d14]/30">·</span>
            )}
            {formattedDate && (
              <span data-tina-field={tinaField(post, 'date')}>{formattedDate}</span>
            )}
          </div>
        </div>

        {/* ── Ingredients ────────────────────────────────────────────────── */}
        {post.ingredients && (
          <div className="mb-8">
            <h2
              data-tina-field={tinaField(post, 'ingredients')}
              className="mb-3 font-heading text-2xl font-normal text-[#2c1d14]"
            >
              Ingredients
            </h2>
            <div
              data-tina-field={tinaField(post, 'ingredients')}
              className="prose prose-stone max-w-none
                prose-p:font-serif prose-p:text-[#2c1d14] prose-p:leading-relaxed
                prose-ul:font-serif prose-li:text-[#2c1d14]"
            >
              <TinaMarkdown content={post.ingredients} components={components} />
            </div>
          </div>
        )}

        {/* ── Method/Instructions ────────────────────────────────────────── */}
        {post.method && (
          <div className="mb-8">
            <h2
              data-tina-field={tinaField(post, 'method')}
              className="mb-3 font-heading text-2xl font-normal text-[#2c1d14]"
            >
              Instructions
            </h2>
            <div
              data-tina-field={tinaField(post, 'method')}
              className="prose prose-stone max-w-none
                prose-p:font-serif prose-p:text-[#2c1d14] prose-p:leading-relaxed
                prose-ol:font-serif prose-li:text-[#2c1d14]"
            >
              <TinaMarkdown content={post.method} components={components} />
            </div>
          </div>
        )}

        {/* ── Storage ────────────────────────────────────────────────────── */}
        {post.storage && (
          <div className="mb-8">
            <h2
              data-tina-field={tinaField(post, 'storage')}
              className="mb-3 font-heading text-2xl font-normal text-[#2c1d14]"
            >
              Storage
            </h2>
            <p
              data-tina-field={tinaField(post, 'storage')}
              className="font-serif text-[#2c1d14] leading-relaxed"
            >
              {post.storage}
            </p>
          </div>
        )}

        {/* ── Body ───────────────────────────────────────────────────────── */}
        <div
          data-tina-field={tinaField(post, '_body')}
          className="prose prose-stone max-w-none
            prose-headings:font-heading prose-headings:font-normal prose-headings:text-[#2c1d14]
            prose-p:font-serif prose-p:text-[#2c1d14] prose-p:leading-relaxed
            prose-a:text-[#a93e33] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-[#2c1d14]
            prose-blockquote:border-l-[#a93e33] prose-blockquote:text-[#2c1d14]/70"
        >
          <TinaMarkdown content={post._body} components={components} />
        </div>

      </article>
    </ErrorBoundary>
  );
}
