import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import Layout from '@/components/layout/layout';
import PageContainer from '@/components/layout/page-container';
import { notFound } from 'next/navigation';

export default async function PrivacyPage() {
  const filePath = path.join(process.cwd(), 'content/pages/privacy.mdx');
  if (!fs.existsSync(filePath)) notFound();
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { content } = matter(raw);
  const bodyHtml = await marked(content);
  return (
    <Layout>
      <PageContainer>
        <div className="prose prose-base max-w-none font-sans text-neutral-800 leading-snug text-justify prose-h2:mt-8 prose-h2:mb-3 prose-p:mt-0 prose-p:mb-4 prose-li:my-1" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      </PageContainer>
    </Layout>
  );
}
