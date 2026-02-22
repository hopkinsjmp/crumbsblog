import { client } from "@/tina/client";
import { Layout } from "@/components/layout/layout";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { components } from "@/components/mdx-components";
import { PageQuery, PageQueryVariables } from "@/tina/__generated__/types";

export default async function ContributePage() {
  const { query, data, variables } = await client.queries.page({
    relativePath: "contribute.md",
  });

  const page = data.page;

  return (
    <Layout>
      <div className="mx-auto max-w-[922px] px-8 py-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-[0.15em] mb-8 text-left">
          {page.title}
        </h1>
        <div className="prose prose-lg font-sans text-neutral-800 leading-relaxed">
          {page.blocks && page.blocks.length > 0 ? (
            page.blocks.map((block: any, idx: number) => (
              <TinaMarkdown key={idx} content={block.body} components={components} />
            ))
          ) : (
            <TinaMarkdown content={page.body} components={components} />
          )}
        </div>
      </div>
    </Layout>
  );
}
