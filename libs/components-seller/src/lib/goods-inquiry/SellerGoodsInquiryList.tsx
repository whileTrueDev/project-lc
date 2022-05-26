/* eslint-disable react/no-array-index-key */
import { Box, Button, ButtonGroup, Center, Spinner, Text } from '@chakra-ui/react';
import { Goods } from '@prisma/client';
import { GoodsInquiryItem } from '@project-lc/components-shared/goods-inquiry/GoodsInquiryItem';
import { useInfiniteGoodsInquiries, useProfile } from '@project-lc/hooks';
import { useState } from 'react';

interface SellerGoodsInquiryListProps {
  goodsId?: Goods['id'];
}
export function SellerGoodsInquiryList({
  goodsId,
}: SellerGoodsInquiryListProps): JSX.Element | null {
  const { data: profile } = useProfile();
  const { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteGoodsInquiries(
      { sellerId: profile?.id, goodsId },
      { enabled: !!profile?.id },
    );

  const [onlyRequested, setOnlyRequested] = useState(false);
  const handleFilterClick = (): void => {
    setOnlyRequested(!onlyRequested);
  };

  if (!data) return null;
  return (
    <Box my={4}>
      {data?.pages[0].goodsInquiries.length === 0 ? (
        <Text textAlign="center">문의 내역이 없습니다</Text>
      ) : (
        <ButtonGroup>
          <Button
            variant="outline"
            size="sm"
            colorScheme="blue"
            onClick={handleFilterClick}
          >
            {!onlyRequested ? '답변 필요한 문의만 보기' : '상품 문의 모두 보기'}
          </Button>
        </ButtonGroup>
      )}

      {data?.pages.map((page, idx) => (
        <Box key={idx}>
          {page.goodsInquiries
            .filter((iq) => (onlyRequested ? iq.status === 'requested' : true))
            .map((inq) => (
              <GoodsInquiryItem key={inq.id} inquiry={inq} />
            ))}
        </Box>
      ))}

      {hasNextPage && (
        <Center>
          <Button isLoading={isFetchingNextPage} onClick={() => fetchNextPage()}>
            더보기
          </Button>
        </Center>
      )}

      {isFetching && !isFetchingNextPage ? (
        <Center>
          <Spinner />
        </Center>
      ) : null}
    </Box>
  );
}
export default SellerGoodsInquiryList;
