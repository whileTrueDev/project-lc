import { Button, Center, Stack, Text } from '@chakra-ui/react';
import { useCustomerInfiniteOrderCancellationList } from '@project-lc/hooks';
import { ExchangeReturnCancelListItem } from './ExchangeReturnCancelListItem';

export function CustomerOrderCancelList({
  customerId,
}: {
  customerId: number;
}): JSX.Element {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCustomerInfiniteOrderCancellationList({
      take: 5,
      customerId,
    });

  return (
    <Stack>
      {data?.pages[0].totalCount === 0 && (
        <Text textAlign="center">주문취소 요청 내역이 없습니다</Text>
      )}
      {data?.pages.map((group, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Stack key={`page-${i}`} spacing={4}>
          {group.list.map((item) => (
            <ExchangeReturnCancelListItem key={item.id} type="cancel" data={item} />
          ))}
        </Stack>
      ))}
      {hasNextPage && (
        <Center>
          <Button
            type="button"
            size="sm"
            isLoading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            더보기
          </Button>
        </Center>
      )}
    </Stack>
  );
}

export default CustomerOrderCancelList;
