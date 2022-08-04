import { Box } from '@chakra-ui/react';
import KkshowLayout from '@project-lc/components-web-kkshow/KkshowLayout';
import { CategoryGoodsList } from '@project-lc/components-web-kkshow/shopping/category/CategoryGoodsList';
import {
  generateGoodsOutlineByCategoryCodeKey,
  getGoodsOutlineByCategoryCode,
  getKkshowShoppingCategories,
  kkshowShoppingCategoriesKey,
} from '@project-lc/hooks';
import { GoodsCategoryWithFamily } from '@project-lc/shared-types';
import { createQueryClient } from '@project-lc/utils-frontend';
import { AxiosError } from 'axios';
import { GetStaticPaths, GetStaticProps } from 'next';
import { dehydrate, DehydratedState } from 'react-query';

type ShoppingCategoryProps = { dehydratedState: DehydratedState };
type ShoppingCategoryParams = { categoryCode: string };
export const getStaticPaths: GetStaticPaths<ShoppingCategoryParams> = async () => {
  const queryClient = createQueryClient();
  const categoryIds = await queryClient.fetchQuery<GoodsCategoryWithFamily[], AxiosError>(
    kkshowShoppingCategoriesKey,
    { queryFn: getKkshowShoppingCategories },
  );
  const paths = categoryIds.map((cid) => ({
    params: { categoryCode: cid.categoryCode },
  }));
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps<
  ShoppingCategoryProps,
  ShoppingCategoryParams
> = async ({ params }) => {
  const queryClient = createQueryClient();
  const queryKey = generateGoodsOutlineByCategoryCodeKey(params.categoryCode);
  await queryClient
    .prefetchQuery(queryKey, () => getGoodsOutlineByCategoryCode(params.categoryCode))
    .catch((err) => {
      throw new Error(
        `Failed to fetch KkshowGoods data categoryCode: ${params.categoryCode} - ${err}`,
      );
    });
  return {
    props: { dehydratedState: dehydrate(queryClient) },
    revalidate: 60,
  };
};

export function ShoppingCategory(): JSX.Element {
  return (
    <Box position="relative">
      <KkshowLayout navbarFirstLink="kkmarket">
        <CategoryGoodsList />
      </KkshowLayout>
    </Box>
  );
}

export default ShoppingCategory;
