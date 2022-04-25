import { Stack, Text, Button, Center } from '@chakra-ui/react';
import { INFINITE_ORDER_LIST_QUERY_KEY, useInfiniteOrderList } from '@project-lc/hooks';
import { GetOrderListDto } from '@project-lc/shared-types';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import CustomerOrderPeriodFilter from './CustomerOrderPeriodFilter';

export function CustomerOrderList({ customerId }: { customerId: number }): JSX.Element {
  const queryClient = useQueryClient();
  const [dto, setDto] = useState<GetOrderListDto>({
    // take 값이 없을때 default take 값은 10 => default take 값 변경은 GetOrderListDto에서
    take: 2,
    customerId,
  });

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteOrderList(dto);

  // 필터 적용으로 dto 가 변경되는 경우
  useEffect(() => {
    // 수동으로 InfiniteOrderList 쿼리 데이터(조회했던 page와 skip)를 초기화
    queryClient.setQueriesData(INFINITE_ORDER_LIST_QUERY_KEY, () => ({
      pages: [],
      pageParams: 0,
    }));
    // 변경된 dto로 조회하기 위해 refetch 실행한다
    refetch();
  }, [dto, queryClient, refetch]);

  if (status === 'loading') return <Text>loading...</Text>;
  if (status === 'error') return <Text>error... {error.message}</Text>;
  if (!data?.pages?.[0]?.count) return <Text>no data</Text>;
  return (
    <Stack>
      <Text>주문/배송내역</Text>
      {/* 주문내역 조회 필터 - 기간 */}
      <CustomerOrderPeriodFilter
        changePeriod={({ periodStart, periodEnd }) => {
          setDto((prev) => ({
            ...prev,
            periodStart,
            periodEnd,
          }));
        }}
      />
      {/* 주문내역목록 */}
      {data.pages.map((group, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Stack key={i}>
          <Text fontWeight="bold"> group index : {i}</Text>
          <Stack>
            {group.orders.map((order) => (
              <Text key={order.id}>
                {order.orderCode} {order.createDate}
              </Text>
            ))}
          </Stack>
        </Stack>
      ))}

      {/* 더보기 버튼 */}
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
      <Text>{JSON.stringify(dto)}</Text>

      <Text>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</Text>
    </Stack>
  );
}

export default CustomerOrderList;
