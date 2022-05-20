/* eslint-disable react/no-array-index-key */
import { Box, Text } from '@chakra-ui/react';
import { useGoodsById } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import ReviewList from '../review/ReviewList';
import { ReviewPolicy } from '../review/ReviewPolicy';

export function GoodsViewReviews(): JSX.Element | null {
  const router = useRouter();
  const goodsId = router.query.goodsId as string;
  const goods = useGoodsById(goodsId);

  return (
    <Box maxW="5xl" m="auto" id="goods-reviews" minH="50vh" p={2} pt={20}>
      <Text fontSize="2xl">상품 후기</Text>

      <ReviewPolicy />

      <ReviewList
        dto={{ skip: 0, take: 5, goodsId: goods.data?.id }}
        enabled={!!goods.data?.id}
      />
    </Box>
  );
}
