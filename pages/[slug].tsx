import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { useTina } from 'tinacms/dist/react';
import client from '@/tina/__generated__/client';
import type { PageQuery, PageQueryVariables } from '@/tina/__generated__/types';
import { Blocks } from '@/components/blocks';
import ErrorBoundary from '@/components/error-boundary';

type SlugPageProps = {
  query: string;
  variables: PageQueryVariables;
  data: PageQuery;
};

export default function SlugPage(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const { data } = useTina(props);

  return (
    <ErrorBoundary>
      <Blocks {...data.page} />
    </ErrorBoundary>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await client.queries.pageConnection();

  const paths = (data.pageConnection.edges || [])
    .map((edge) => edge?.node?._sys?.breadcrumbs || [])
    .filter((breadcrumbs) => breadcrumbs.length === 1)
    .filter((breadcrumbs) => breadcrumbs[0] !== 'home')
    .map(([slug]) => ({
      params: { slug },
    }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<SlugPageProps> = async ({
  params,
}) => {
  const slug = params?.slug;

  if (typeof slug !== 'string') {
    return {
      notFound: true,
    };
  }

  try {
    const pageData = await client.queries.page({
      relativePath: `${slug}.mdx`,
    });

    return {
      props: pageData,
      revalidate: 300,
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
