import {
  Button,
  Center,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import CustomAvatar from '@project-lc/components-core/CustomAvatar';
import { TextDotConnector } from '@project-lc/components-core/TextDotConnector';
import { INFINITE_ORDER_LIST_QUERY_KEY, useInfiniteOrderList } from '@project-lc/hooks';
import { GetOrderListDto, OrderDataWithRelations } from '@project-lc/shared-types';
import { getFilteredCustomerOrderItems } from '@project-lc/utils-frontend';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useQueryClient } from 'react-query';
import { OrderItem } from './CustomerOrderItem';
import CustomerOrderPeriodFilter, { PeriodInputs } from './CustomerOrderPeriodFilter';

export function CustomerOrderList({ customerId }: { customerId: number }): JSX.Element {
  const queryClient = useQueryClient();
  const [dto, setDto] = useState<GetOrderListDto>({
    // take 값이 없을때 default take 값은 10 => default take 값 변경은 GetOrderListDto에서
    take: 5,
    customerId,
  });

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
    isLoading,
  } = useInfiniteOrderList(dto);

  // * 무한 스크롤링
  const { ref, inView } = useInView({ threshold: 1 });
  // ref 전달한 더보기버튼이 화면에 들어왔는지 확인하여 다음목록 요청
  useEffect(() => {
    if (inView) fetchNextPage();
  }, [fetchNextPage, inView]);

  // * 필터링
  const handleFilter = ({ periodStart, periodEnd }: PeriodInputs): void => {
    setDto((prev) => ({ ...prev, periodStart, periodEnd }));
    // 필터 적용으로 dto 가 변경되는 경우
    // 수동으로 InfiniteOrderList 쿼리 데이터(조회했던 page와 skip)를 초기화
    queryClient.setQueriesData(INFINITE_ORDER_LIST_QUERY_KEY, () => ({
      pages: [],
      pageParams: 0,
    }));
    // 변경된 dto로 조회하기 위해 refetch 실행한다
    refetch();
  };

  if (status === 'error')
    return <Text>주문내역을 조회하던 중 오류가 발생하였습니다 {error.message}</Text>;
  return (
    <Stack>
      <Text fontSize="xl" fontWeight="bold">
        주문/배송내역
      </Text>

      {/* 주문내역 조회 필터 - 기간 */}
      <CustomerOrderPeriodFilter changePeriod={handleFilter} />

      <Stack px={1} py={4}>
        {/* 주문내역목록 */}
        {data?.pages.map((group, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Stack key={`page-${i}`} spacing={4}>
            {group.orders.map((order) => (
              <OrderData key={order.id} order={order} />
            ))}
          </Stack>
        ))}
        {isLoading && (
          <Center>
            <Spinner />
          </Center>
        )}
        {(data?.pages?.[0]?.count === 0 || !data?.pages?.[0]?.orders.length) && (
          <Text textAlign="center">주문내역이 없습니다</Text>
        )}
        {/* 더보기 버튼 */}
        {hasNextPage && (
          <Center>
            {/* 모바일 더보기 버튼 - inViewRef 연결하여 모바일 화면일때만 스크롤시 자동 불러오기 */}
            <Button
              display={{ base: 'block', md: 'none' }}
              type="button"
              colorScheme="blue"
              ref={ref}
              isLoading={isFetchingNextPage}
              onClick={() => fetchNextPage()}
            >
              더보기
            </Button>
            {/* 데스크탑 더보기 버튼 */}
            <Button
              display={{ base: 'none', md: 'block' }}
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
  const router = useRouter();
  const handleDetailClick = (): void => {
    router.push(`/mypage/orders/${order.orderCode}`);
  };

  const giftBroadcaster = order.orderItems.find((oi) => !!oi.support)?.support
    ?.broadcaster;

  const filteredOrderItems = useMemo(() => {
    return getFilteredCustomerOrderItems({ order });
  }, [order]);
  return (
    <Stack
      borderWidth="1px"
      borderRadius="md"
      p={1}
      boxShadow="md"
      bg={orderDataBgColor}
      spacing={1}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction={{ base: 'column', sm: 'row' }}>
          <Text>주문번호 : {order.orderCode}</Text>
          <TextDotConnector display={{ base: 'none', sm: 'block' }} />
          <Text>주문일자 : {dayjs(order.createDate).format('YYYY-MM-DD')}</Text>
        </Stack>

        <Button size="sm" onClick={handleDetailClick}>
          상세보기
        </Button>
      </Stack>
      {order.giftFlag && giftBroadcaster && (
        <Stack direction="row" alignItems="center" px={1}>
          <CustomAvatar size="xs" src={giftBroadcaster?.avatar || ''} />
          <Text fontWeight="bold">{giftBroadcaster.userNickname}</Text>
          <Text>님께 보낸 선물 🎁</Text>
        </Stack>
      )}

      <Stack px={1}>
        {filteredOrderItems.map((item) => (
          <OrderItem key={item.id} orderItem={item} order={order} />
        ))}
      </Stack>
    </Stack>
  );
}
