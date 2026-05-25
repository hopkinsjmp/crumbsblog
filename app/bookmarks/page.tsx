import { Metadata } from 'next';
import Layout from '@/components/layout/layout';
import BookmarksClientPage from './client-page';

export const metadata: Metadata = {
  title: 'Bookmarks',
  description: "Carmel's curated list of favourite recipes, reads, and resources.",
  openGraph: {
    title: 'Bookmarks | Crumbs of Sanity',
    description: "Carmel's curated list of favourite recipes, reads, and resources.",
    type: 'website',
  },
};

export default function BookmarksPage() {
  return (
    <Layout>
      <BookmarksClientPage />
    </Layout>
  );
}
