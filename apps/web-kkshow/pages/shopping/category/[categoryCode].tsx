import { Box } from '@chakra-ui/react';
import KkshowLayout from '@project-lc/components-web-kkshow/KkshowLayout';
import {
  generateGoodsOutlineByCategoryCodeKey,
  getGoodsOutlineByCategoryCode,
  getKkshowShoppingCategories,
  kkshowShoppingCategoriesKey,
  useGoodsOutlineByCategoryCode,
  useOneGoodsCategory,
} from '@project-lc/hooks';
import { GoodsCategoryWithFamily } from '@project-lc/shared-types';
import { createQueryClient } from '@project-lc/utils-frontend';
import { AxiosError } from 'axios';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
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
  const router = useRouter();
  const categoryCode = router.query.categoryCode as string;

  const { data } = useOneGoodsCategory(categoryCode);
  const { data: goodsList } = useGoodsOutlineByCategoryCode(data?.categoryCode);
  console.log(goodsList);

  return (
    <Box overflow="hidden" position="relative">
      <KkshowLayout>
        <Box maxW="5xl" margin="auto" w="100%" p={2}>
          카테고리별 상품 목록 {categoryCode}
        </Box>

        <Box maxW="5xl" margin="auto" w="100%" p={2}>
          {goodsList?.map((goods) => (
            <Box key={goods.id}>{goods.goods_name}</Box>
          ))}
        </Box>
      </KkshowLayout>
    </Box>
  );
}

export default ShoppingCategory;
