'use client';
import Image from 'next/image';
import { tinaField, useTina } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { components } from '@/components/mdx-components';
import { PageQuery, PageQueryVariables } from '@/tina/__generated__/types';
import { withBasePath } from '@/lib/utils';

interface ClientInfoPageProps {
  data: PageQuery;
  variables: PageQueryVariables;
  query: string;
}

export default function InfoClientPage(props: ClientInfoPageProps) {
  const { data } = useTina({ ...props });
  const page = data.page as any;

  return (
    <div className="mx-auto max-w-[922px] px-8 py-6">
      <h1
        data-tina-field={tinaField(page, 'title')}
        className="font-serif text-4xl md:text-5xl font-bold mb-4 text-left"
      >
        {page.title}
      </h1>

      {/* Image floats top-left, text wraps around it */}
      <div>
        {page.headerImage && (
          <div
            data-tina-field={tinaField(page, 'headerImage')}
            className="float-left mr-8 mb-4 w-48 md:w-64"
          >
            <Image
              src={withBasePath(page.headerImage)}
              alt={page.title}
              width={256}
              height={320}
              className="w-full rounded-lg object-cover shadow-md"
              unoptimized
            />
          </div>
        )}

        {/* Body text wraps around the floated image */}
        <div
          data-tina-field={tinaField(page, 'body')}
          className="prose prose-base font-sans text-neutral-800 leading-snug
            prose-h2:mt-8 prose-h2:mb-3
            prose-p:mt-0 prose-p:mb-4
            prose-li:my-1"
        >
          <TinaMarkdown content={page.body} components={components} />
        </div>
        <div className="clear-both" />
      </div>
    </div>
  );
}
