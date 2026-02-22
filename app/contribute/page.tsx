import client from '@/tina/__generated__/client';
import Layout from '@/components/layout/layout';
import { notFound } from 'next/navigation';
import ClientPage from './client-page';

export default async function ContributePage() {
  let data;
  try {
    data = await client.queries.page({
      relativePath: 'contribute.mdx',
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
