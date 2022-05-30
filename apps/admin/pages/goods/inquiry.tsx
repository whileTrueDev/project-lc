/* eslint-disable react/no-array-index-key */
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Heading,
  Spinner,
  Text,
} from '@chakra-ui/react';
import AdminPageLayout from '@project-lc/components-admin/AdminPageLayout';
import { GoodsInquiryItem } from '@project-lc/components-shared/goods-inquiry/GoodsInquiryItem';
import { useInfiniteGoodsInquiries } from '@project-lc/hooks';
import { useState } from 'react';

export function Inquiry(): JSX.Element {
  return (
    <AdminPageLayout>
      <Heading>상품 문의 관리</Heading>

      <Box maxW="5xl">
        <AdminGoodsInquiryList />
      </Box>
    </AdminPageLayout>
  );
}

export default Inquiry;

export function AdminGoodsInquiryList(): JSX.Element | null {
  const { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteGoodsInquiries({});

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
              <GoodsInquiryItem key={inq.id} inquiry={inq} deletable />
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
