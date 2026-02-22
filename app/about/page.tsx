import client from '@/tina/__generated__/client';
import Layout from '@/components/layout/layout';
import { notFound } from 'next/navigation';
import ClientPage from './client-page';

export default async function AboutPage() {
  let data;
  try {
    data = await client.queries.info({
      relativePath: 'about.md',
    });
  } catch (error) {
    notFound();
  }

  return (
    <Layout>
      <ClientPage {...data} />
    </Layout>
  );
}
