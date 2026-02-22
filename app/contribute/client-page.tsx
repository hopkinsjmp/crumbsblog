'use client';
import { tinaField, useTina } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { components } from '@/components/mdx-components';
import { PageQuery, PageQueryVariables } from '@/tina/__generated__/types';

interface ClientInfoPageProps {
  data: PageQuery;
  variables: PageQueryVariables;
  query: string;
}

export default function InfoClientPage(props: ClientInfoPageProps) {
  const { data } = useTina({ ...props });
  const page = data.page as any;

  return (
    <div className="mx-auto max-w-[922px] px-8 py-12">
      <h1
        data-tina-field={tinaField(page, 'title')}
        className="font-serif text-4xl md:text-5xl font-bold tracking-[0.15em] mb-8 text-left"
      >
        {page.title}
      </h1>
      <div
        data-tina-field={tinaField(page, 'body')}
        className="prose prose-lg font-sans text-neutral-800 leading-relaxed"
      >
        <TinaMarkdown content={page.body} components={components} />
      </div>
    </div>
  );
}
