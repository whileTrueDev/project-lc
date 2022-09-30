import { Box } from '@chakra-ui/react';
import { KkshowLayout } from '@project-lc/components-web-kkshow/KkshowLayout';
import { ShoppingSectionsContainer } from '@project-lc/components-web-kkshow/shopping/ShoppingSectionsContainer';
import {
  getKkshowShoppingCategories,
  getKkshowShoppingSectionsData,
  kkshowShoppingCategoriesKey,
  kkshowShoppingSectionsQueryKey,
} from '@project-lc/hooks';
import { createQueryClient } from '@project-lc/utils-frontend';
import { GetStaticProps } from 'next';
import { dehydrate, DehydratedState } from 'react-query';

interface KkshowShippingProps {
  dehydratedState: DehydratedState;
}
export const getStaticProps: GetStaticProps<KkshowShippingProps> = async () => {
  const queryClient = createQueryClient();
  await queryClient
    .prefetchQuery(kkshowShoppingSectionsQueryKey, getKkshowShoppingSectionsData)
    .catch((err) => {
      throw new Error(`Failed to fetch KkshowShopping data - ${err}`);
    });

  await queryClient
    .prefetchQuery(kkshowShoppingCategoriesKey, getKkshowShoppingCategories)
    .catch((err) => {
      throw new Error(`Failed to fetch KkshowShoppingCategory data - ${err}`);
    });

  return {
    props: { dehydratedState: dehydrate(queryClient) },
    revalidate: 60,
  };
};

export default function Shopping(): JSX.Element {
  return (
    <Box position="relative">
      <KkshowLayout navbarFirstLink="kkmarket">
        <ShoppingSectionsContainer />
      </KkshowLayout>
    </Box>
  );
}
