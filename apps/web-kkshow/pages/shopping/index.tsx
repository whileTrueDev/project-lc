import { Box } from '@chakra-ui/react';
import { SignupEventPopup } from '@project-lc/components-web-kkshow/EventPopup';
import { KkshowLayout } from '@project-lc/components-web-kkshow/KkshowLayout';
import { ShoppingCarousel } from '@project-lc/components-web-kkshow/shopping/ShoppingCarousel';
import { ShoppingCategories } from '@project-lc/components-web-kkshow/shopping/ShoppingCategories';
import { ShoppingEventBanner } from '@project-lc/components-web-kkshow/shopping/ShoppingEventBanner';
import { ShoppingGoodsOfTheWeek } from '@project-lc/components-web-kkshow/shopping/ShoppingGoodsOfTheWeek';
import { ShoppingNewLineUp } from '@project-lc/components-web-kkshow/shopping/ShoppingNewLineUp';
import { ShoppingPopularGoods } from '@project-lc/components-web-kkshow/shopping/ShoppingPopularGoods';
import { ShoppingRecommendations } from '@project-lc/components-web-kkshow/shopping/ShoppingRecommendations';
import { ShoppingReviews } from '@project-lc/components-web-kkshow/shopping/ShoppingReviews';
import {
  getKkshowShopping,
  getKkshowShoppingCategories,
  kkshowShoppingCategoriesKey,
  kkshowShoppingQueryKey,
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
    .prefetchQuery(kkshowShoppingQueryKey, getKkshowShopping)
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
      {/* 신규가입 이벤트 팝업 */}
      <SignupEventPopup />

      <KkshowLayout navbarFirstLink="kkmarket">
        <ShoppingCarousel />
        <ShoppingCategories />
        <ShoppingGoodsOfTheWeek />
        <ShoppingNewLineUp />
        <ShoppingPopularGoods />
        <ShoppingEventBanner />
        <ShoppingRecommendations />
        <ShoppingReviews />
        {/* <ShoppingKeywords /> */}
      </KkshowLayout>
    </Box>
  );
}
