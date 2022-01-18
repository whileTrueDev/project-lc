import { Box, Heading, Spinner, Text, Stack } from '@chakra-ui/react';
import { LiveShoppingPurchaseMessage } from '@prisma/client';
import { usePurchaseMessages } from '@project-lc/hooks';
import { useMemo } from 'react';

export interface LiveShoppingCurrentStateBoardProps {
  liveShoppingId: number;
  title: string;
}

export function LiveShoppingCurrentStateAdminMessage(): JSX.Element {
  return <Box>관리자 메시지 : // TODO 관리자 메시지를 표시해야함</Box>;
}

export function PurchaseMessageItem({
  item,
  index,
}: {
  item: LiveShoppingPurchaseMessage;
  index: number;
}): JSX.Element {
  const { nickname, text, price, giftFlag } = item;
  return (
    <Stack direction="row">
      <Text>{index}</Text>
      <Text>{nickname}</Text>
      <Text>
        {giftFlag && '(선물)'}
        {text}
      </Text>
      <Text>{price.toLocaleString()}원</Text>
    </Stack>
  );
}

export function LiveShoppingCurrentStateBoard({
  liveShoppingId,
  title,
}: LiveShoppingCurrentStateBoardProps): JSX.Element {
  const { data, status, error, isFetching } = usePurchaseMessages({
    liveShoppingId,
    // refetchInterval: 10 * 1000, // 10초에 한번
  });

  const { totalPrice, totalPurchaseCount, totalGiftCount } = useMemo(() => {
    if (!data) return { totalPrice: 0, totalPurchaseCount: 0, totalGiftCount: 0 };
    return {
      totalPrice: data.reduce((acc, d) => acc + d.price, 0),
      totalPurchaseCount: data.length,
      totalGiftCount: data.filter((d) => !!d.giftFlag).length,
    };
  }, [data]);

  if (status === 'loading') return <Box>Loading...</Box>;
  if (status === 'error' && error) return <Box>Error: {error.message}</Box>;

  return (
    <Box>
      {/* 라이브쇼핑명 - 제목 */}
      <Heading>
        {title} {isFetching && <Spinner />}
      </Heading>

      {/* 관리자메시지 */}
      <LiveShoppingCurrentStateAdminMessage />
      {/* 라이브 상황판 */}
      <Box>
        <Text>라이브 상황판</Text>
        <Text>결제금액 : {totalPrice.toLocaleString()} 원</Text>
        <Text>주문건수 : {totalPurchaseCount} 건</Text>
        <Text>선물건수 : {totalGiftCount} 건</Text>
      </Box>

      {/* 응원메시지 목록 */}
      <Box>
        <Text>응원메시지</Text>
        <Box maxH={200} overflowY="auto">
          {data &&
            data.map((d, index) => (
              <PurchaseMessageItem item={d} index={data.length - index} key={d.id} />
            ))}
        </Box>
      </Box>
    </Box>
  );
}

export default LiveShoppingCurrentStateBoard;
