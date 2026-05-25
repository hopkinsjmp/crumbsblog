import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import Layout from '@/components/layout/layout';
import PageContainer from '@/components/layout/page-container';
import { notFound } from 'next/navigation';
import ContactForm from '@/app/contact/contact-form';

export default async function ContributePage() {
  const filePath = path.join(process.cwd(), 'content/pages/contribute.mdx');
  if (!fs.existsSync(filePath)) notFound();
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { content } = matter(raw);
  const bodyHtml = await marked(content);
  return (
    <Layout>
      <PageContainer>
        <div
          className="prose prose-base max-w-none font-serif text-neutral-800 leading-snug text-justify prose-h2:mt-8 prose-h2:mb-3 prose-p:mt-0 prose-p:mb-4 prose-li:my-1"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
        <div className="mt-10 border-t border-[#2c1d14]/10 pt-8">
          <h2 className="font-serif text-2xl font-normal text-[#2c1d14] mb-2">Get in touch</h2>
          <p className="font-sans text-sm text-[#2c1d14]/60 mb-6">
            Interested in contributing, or have a question?{' '}
            <a href="mailto:carmel@crumbsofsanity.com" className="text-[#a93e33] underline underline-offset-2 hover:text-[#7a2d24]">
              Write me an email
            </a>
            , or drop me a message below.
          </p>
          <ContactForm />
        </div>
      </PageContainer>
    </Layout>
  );
}
