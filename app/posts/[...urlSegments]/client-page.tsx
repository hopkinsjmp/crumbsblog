'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { tinaField, useTina } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { PostQuery } from '@/tina/__generated__/types';
import { components } from '@/components/mdx-components';
import ErrorBoundary from '@/components/error-boundary';
import { withBasePath } from '@/lib/utils';
import PageContainer from '@/components/layout/page-container';

/**
 * Renders a plain-text recipe field (ingredients or method) stored as a
 * markdown-style string in YAML frontmatter. Converts `* item` lines to a
 * <ul>, `1. step` lines to an <ol>, section headers (no leading marker) to
 * <strong> labels, and blank lines to paragraph breaks.
 */
function RecipeText({ text }: { text: string }) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let ulItems: string[] = [];
  let olItems: string[] = [];

  const flushUl = () => {
    if (ulItems.length) {
      elements.push(<ul key={elements.length} className="list-disc pl-5 font-serif text-[#2c1d14] space-y-1">{ulItems.map((t, i) => <li key={i}>{t}</li>)}</ul>);
      ulItems = [];
    }
  };
  const flushOl = () => {
    if (olItems.length) {
      elements.push(<ol key={elements.length} className="list-decimal pl-5 font-serif text-[#2c1d14] space-y-2">{olItems.map((t, i) => <li key={i}>{t}</li>)}</ol>);
      olItems = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) continue;
    const ulMatch = line.match(/^\s*[\*\-]\s+(.+)/);
    const olMatch = line.match(/^\s*\d+\.\s+(.+)/);
    if (ulMatch) { flushOl(); ulItems.push(ulMatch[1]); }
    else if (olMatch) { flushUl(); olItems.push(olMatch[1]); }
    else { flushUl(); flushOl(); elements.push(<p key={elements.length} className="font-serif font-semibold text-[#2c1d14] mt-4 mb-1">{line.trim()}</p>); }
  }
  flushUl();
  flushOl();
  return <div className="space-y-2">{elements}</div>;
}

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

type Tab = 'story' | 'recipe';

interface ClientPostProps {
  data: PostQuery;
  variables: { relativePath: string };
  query: string;
}

export default function PostClientPage(props: ClientPostProps) {
  const { data } = useTina({ ...props });
  const post = data.post;

  const date = new Date(post.date!);
  const formattedDate = !isNaN(date.getTime()) ? format(date, 'MMMM d, yyyy') : '';

  const hasRecipe =
    !!post.ingredients ||
    !!post.method ||
    !!post.storage ||
    !!post.servings ||
    !!post.dietaryNotes ||
    !!post.handsOnTime ||
    !!post.handOffTime;

  const hasPhotos = !!post.heroImg;
  const hasTabs = hasRecipe;

  const [activeTab, setActiveTab] = useState<Tab>('story');

  const tabClass = (tab: Tab) =>
    `flex-1 sm:flex-none px-5 py-2.5 font-sans text-sm font-medium transition-colors border-b-2 -mb-px ${
      activeTab === tab
        ? 'border-[#a93e33] text-[#a93e33]'
        : 'border-transparent text-[#2c1d14]/50 hover:text-[#2c1d14]'
    }`;

  return (
    <ErrorBoundary>
      <PageContainer>

        {/* Title */}
        <h1
          data-tina-field={tinaField(post, 'title')}
          className="mb-4 font-heading text-4xl font-normal leading-tight text-[#2c1d14] md:text-5xl"
        >
          {post.title}
        </h1>

        {/* Author + date byline + metadata badges */}
        <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2">
          {/* Avatar + name + date */}
          <div data-tina-field={tinaField(post, 'author')} className="flex items-center gap-3">
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
                <span data-tina-field={tinaField(post.author, 'name')} className="font-semibold text-[#2c1d14]">
                  By {post.author.name}
                </span>
              )}
              {post.author?.name && formattedDate && <span className="mx-2 text-[#2c1d14]/30">·</span>}
              {formattedDate && <span data-tina-field={tinaField(post, 'date')}>{formattedDate}</span>}
            </div>
          </div>

          {/* Metadata badges */}
          {(post.degreeStage || post.subject || post.frameOfMind) && (
            <>
              <span className="hidden text-[#2c1d14]/20 sm:inline">|</span>
              <div className="flex flex-wrap items-center gap-2 text-sm text-[#2c1d14]/70">
                {post.degreeStage && (
                  <span className="relative group">
                    <span data-tina-field={tinaField(post, 'degreeStage')} className="rounded-full bg-[#2c1d14]/5 px-3 py-1 cursor-default">
                      🎓 {post.degreeStage}
                    </span>
                    <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded bg-[#2c1d14] px-2 py-1 font-sans text-xs text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                      Degree stage
                    </span>
                  </span>
                )}
                {post.subject && (
                  <span className="relative group">
                    <span data-tina-field={tinaField(post, 'subject')} className="rounded-full bg-[#2c1d14]/5 px-3 py-1 cursor-default">
                      📘 {post.subject}
                    </span>
                    <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded bg-[#2c1d14] px-2 py-1 font-sans text-xs text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                      Subject
                    </span>
                  </span>
                )}
                {post.frameOfMind && (
                  <span className="relative group">
                    <span data-tina-field={tinaField(post, 'frameOfMind')} className="flex items-center gap-2 rounded-full bg-[#2c1d14]/5 px-3 py-1 cursor-default">
                      {post.frameOfMind.emoji && <span data-tina-field={tinaField(post.frameOfMind, 'emoji')}>{post.frameOfMind.emoji}</span>}
                      {post.frameOfMind.description && <span data-tina-field={tinaField(post.frameOfMind, 'description')}>{post.frameOfMind.description}</span>}
                    </span>
                    <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded bg-[#2c1d14] px-2 py-1 font-sans text-xs text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                      Frame of mind
                    </span>
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Tabs */}
        {hasTabs && (
          <div className="mb-6 flex gap-0 border-b border-[#2c1d14]/15">
            <button onClick={() => setActiveTab('story')} className={tabClass('story')}>
              The Story
            </button>
            {hasRecipe && (
              <button onClick={() => setActiveTab('recipe')} className={tabClass('recipe')}>
                The Recipe
              </button>
            )}
          </div>
        )}

        {/* Story tab */}
        {(!hasTabs || activeTab === 'story') && (
          <div>
            {post.excerpt && (
              <div data-tina-field={tinaField(post, 'excerpt')} className="mb-4 font-serif text-lg italic leading-relaxed text-[#2c1d14]/80">
                <TinaMarkdown content={post.excerpt} />
              </div>
            )}
            <div
              data-tina-field={tinaField(post, '_body')}
              className="prose prose-stone max-w-none
                prose-headings:font-heading prose-headings:font-normal prose-headings:text-[#2c1d14]
                prose-p:font-serif prose-p:text-[#2c1d14] prose-p:leading-relaxed prose-p:text-justify
                prose-a:text-[#a93e33] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-[#2c1d14]
                prose-blockquote:border-l-[#a93e33] prose-blockquote:text-[#2c1d14]/70"
            >
              {hasPhotos && (
                <div
                  data-tina-field={tinaField(post, 'heroImg')}
                  className="mb-6 w-full overflow-hidden rounded-lg md:float-right md:ml-8 md:mb-4 md:w-[50%]"
                >
                  <Image
                    priority
                    src={withBasePath(post.heroImg!)}
                    alt={post.title}
                    width={600}
                    height={400}
                    className="w-full object-cover"
                    unoptimized
                  />
                </div>
              )}
              <TinaMarkdown content={post._body} components={components} />
            </div>
          </div>
        )}

        {/* Recipe tab */}
        {hasTabs && activeTab === 'recipe' && (
          <div>
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
            {(post.handsOnTime || post.handOffTime) && (
              <div className="mb-6 text-sm text-[#2c1d14]/70">
                <strong className="text-[#2c1d14]">Time:</strong>
                {post.handsOnTime && (
                  <div data-tina-field={tinaField(post, 'handsOnTime')} className="ml-4">Hands-on: {post.handsOnTime}</div>
                )}
                {post.handOffTime && (
                  <div data-tina-field={tinaField(post, 'handOffTime')} className="ml-4">Hands-off: {post.handOffTime}</div>
                )}
              </div>
            )}
            {!!post.ingredients && (
              <div className="mb-8">
                <h2 data-tina-field={tinaField(post, 'ingredients')} className="mb-3 font-heading text-2xl font-normal text-[#2c1d14]">
                  Ingredients
                </h2>
                <div
                  data-tina-field={tinaField(post, 'ingredients')}
                  className="prose prose-stone max-w-none prose-p:font-serif prose-p:text-[#2c1d14] prose-p:leading-relaxed prose-ul:font-serif prose-li:text-[#2c1d14]"
                >
                  <RecipeText text={post.ingredients} />
                </div>
              </div>
            )}
            {!!post.method && (
              <div className="mb-8">
                <h2 data-tina-field={tinaField(post, 'method')} className="mb-3 font-heading text-2xl font-normal text-[#2c1d14]">
                  Instructions
                </h2>
                <div
                  data-tina-field={tinaField(post, 'method')}
                  className="prose prose-stone max-w-none prose-p:font-serif prose-p:text-[#2c1d14] prose-p:leading-relaxed prose-ol:font-serif prose-li:text-[#2c1d14]"
                >
                  <RecipeText text={post.method} />
                </div>
              </div>
            )}
            {post.storage && (
              <div className="mb-8">
                <h2 data-tina-field={tinaField(post, 'storage')} className="mb-3 font-heading text-2xl font-normal text-[#2c1d14]">
                  Storage
                </h2>
                <p data-tina-field={tinaField(post, 'storage')} className="font-serif text-[#2c1d14] leading-relaxed">
                  {post.storage}
                </p>
              </div>
            )}
          </div>
        )}

      </PageContainer>
    </ErrorBoundary>
  );
}
