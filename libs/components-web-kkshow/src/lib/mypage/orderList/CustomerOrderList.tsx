import { Button, Center, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { TextDotConnector } from '@project-lc/components-core/TextDotConnector';
import { INFINITE_ORDER_LIST_QUERY_KEY, useInfiniteOrderList } from '@project-lc/hooks';
import { GetOrderListDto, OrderDataWithRelations } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { OrderItem } from './CustomerOrderItem';
import CustomerOrderPeriodFilter from './CustomerOrderPeriodFilter';

export function CustomerOrderList({ customerId }: { customerId: number }): JSX.Element {
  const queryClient = useQueryClient();
  const [dto, setDto] = useState<GetOrderListDto>({
    // take 값이 없을때 default take 값은 10 => default take 값 변경은 GetOrderListDto에서
    take: 2,
    customerId,
  });

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, status, refetch } =
    useInfiniteOrderList(dto);

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

  const orderListBgColor = useColorModeValue('gray.50', 'gray.900');

  if (status === 'loading') return <Text>loading...</Text>;
  if (status === 'error') return <Text>error... {error.message}</Text>;
  if (!data?.pages?.[0]?.count) return <Text>no data</Text>;
  return (
    <Stack>
      <Text fontWeight="bold">주문/배송내역</Text>

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

      <Stack bg={orderListBgColor} px={1} py={4}>
        {/* 주문내역목록 */}
        {data.pages.map((group, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Stack key={`page-${i}`} spacing={4}>
            {group.orders.map((order) => (
              <OrderData key={order.id} order={order} />
            ))}
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
      </Stack>
    </Stack>
  );
}

export default CustomerOrderList;

function OrderData({ order }: { order: OrderDataWithRelations }): JSX.Element {
  const orderDataBgColor = useColorModeValue('white', 'gray.800');
  return (
    <Stack borderWidth="1px" borderRadius="md" p={1} boxShadow="md" bg={orderDataBgColor}>
      <Stack direction="row" justifyContent="space-between">
        <Stack direction={{ base: 'column', sm: 'row' }}>
          <Text>주문번호 : {order.orderCode}</Text>
          <TextDotConnector display={{ base: 'none', sm: 'block' }} />
          <Text>주문일자 : {dayjs(order.createDate).format('YYYY-MM-DD')}</Text>
        </Stack>

        <Button
          size="sm"
          onClick={() => {
            console.log('주문 상세보기 페이지로 이동');
          }}
        >
          상세보기
        </Button>
      </Stack>

      <Stack p={1}>
        {order.orderItems.map((item) => (
          <OrderItem
            key={item.id}
            orderItem={item}
            orderConfirmed={!!order.purchaseConfirmationDate}
          />
        ))}
      </Stack>
    </Stack>
  );
}
