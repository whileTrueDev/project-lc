/* eslint-disable react/no-array-index-key */
import {
  Box,
  Button,
  Center,
  SimpleGrid,
  Spinner,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useLiveShoppingNowOnLive, usePromotionPageGoods } from '@project-lc/hooks';
import { Fragment, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import PromotinoPageGoodsDisplay from './PromotionPageGoodsDisplay';

interface PromotionPageGoodsListProps {
  broadcasterId: number | string;
}
export function PromotionPageGoodsList({
  broadcasterId,
}: PromotionPageGoodsListProps): JSX.Element {
  const take = useBreakpointValue({ base: 3, sm: 2, md: 3 });
  // 상품홍보 상품 목록 조회
  const {
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
    data: promotionItems,
  } = usePromotionPageGoods(broadcasterId, { take });

  // ref 전달한 더보기버튼이 화면에 들어왔는지 확인하여 다음목록 요청
  const { ref, inView } = useInView({ threshold: 1 });
  useEffect(() => {
    if (inView) fetchNextPage();
  }, [fetchNextPage, inView]);

  // 라이브쇼핑 상품 조회
  const liveShopping = useLiveShoppingNowOnLive({
    broadcasterId: Number(broadcasterId),
  });

  return (
    <Box>
      <Box mt={30}>
        {liveShopping.data && liveShopping.data.length > 0 && (
          <Box>
            <Text as="h5" fontSize="xl" fontWeight="bold">
              현재 라이브 진행중 상품
            </Text>
            <SimpleGrid mt={4} columns={[1, 2, 3]} spacing={4}>
              {liveShopping.data?.map((x) => (
                <PromotinoPageGoodsDisplay
                  broadcasterId={broadcasterId}
                  key={x.goodsId}
                  item={x}
                  isLive
                />
              ))}
            </SimpleGrid>
          </Box>
        )}

        <Box mt={10}>
          <Text as="h5" fontSize="xl" fontWeight="bold">
            홍보중 상품
          </Text>
          <SimpleGrid mt={4} columns={[1, 2, 3]} spacing={4}>
            {promotionItems &&
              promotionItems.pages.map((page, idx) => (
                <Fragment key={idx}>
                  {page.productPromotions.map((promotionItem) => (
                    <PromotinoPageGoodsDisplay
                      broadcasterId={broadcasterId}
                      key={promotionItem.id}
                      item={promotionItem}
                      isLive={liveShopping.data?.some(
                        (ls) => ls.goodsId === promotionItem.goods.id,
                      )}
                    />
                  ))}
                </Fragment>
              ))}
          </SimpleGrid>
        </Box>
      </Box>

      {hasNextPage && (
        <Center mt={10}>
          <Button
            ref={ref}
            isLoading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            더보기
          </Button>
        </Center>
      )}

      {isLoading || (isFetching && !isFetchingNextPage) ? (
        <Center mt={10}>
          <Spinner />
        </Center>
      ) : null}
    </Box>
  );
}

export default PromotionPageGoodsList;
