"use client";
import { tinaField, useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { Blocks } from "@/components/blocks";
import { PageQuery } from "@/tina/__generated__/types";
import ErrorBoundary from "@/components/error-boundary";
import { components } from "@/components/mdx-components";

export interface ClientPageProps {
  data: {
    page: PageQuery["page"];
  };
  variables: {
    relativePath: string;
  };
  query: string;
}

export default function ClientPage(props: ClientPageProps) {
  const { data } = useTina({ ...props });
  const page = data?.page;
  const hasBlocks = !!page?.blocks?.length;

  return (
    <ErrorBoundary>
      {hasBlocks ? (
        <Blocks {...page} />
      ) : (
        <div data-tina-field={tinaField(page, "body")}>
          <TinaMarkdown content={page?.body} components={components} />
        </div>
      )}
    </ErrorBoundary>
  );
}
