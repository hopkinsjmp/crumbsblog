import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import Image from 'next/image';
import Layout from '@/components/layout/layout';
import PageContainer from '@/components/layout/page-container';
import { withBasePath } from '@/lib/utils';
import { notFound } from 'next/navigation';

export default async function AboutPage() {
  const filePath = path.join(process.cwd(), 'content/pages/about.mdx');
  if (!fs.existsSync(filePath)) notFound();

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(raw);
  const bodyHtml = await marked(content);

  return (
    <Layout>
      <PageContainer>
        <div>
          {frontmatter.headerImage && (
            <div className="float-left mr-8 mb-4 w-48 md:w-64">
              <Image
                src={withBasePath(frontmatter.headerImage)}
                alt={frontmatter.title ?? 'About'}
                width={256}
                height={320}
                className="w-full rounded-lg object-cover shadow-md"
                unoptimized
              />
            </div>
          )}
          <div
            className="prose prose-base max-w-none font-serif text-neutral-800 leading-snug text-justify
              prose-h2:mt-8 prose-h2:mb-3
              prose-p:mt-0 prose-p:mb-4
              prose-li:my-1"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
          <div className="clear-both" />
        </div>
      </PageContainer>
    </Layout>
  );
}
