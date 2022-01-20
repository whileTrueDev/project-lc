import { Box, Heading, Spinner, Stack, Text } from '@chakra-ui/react';
import { LiveShoppingPurchaseMessage } from '@prisma/client';
import { usePurchaseMessages } from '@project-lc/hooks';
import { useEffect, useMemo, useState } from 'react';
import LiveShoppingCurrentStateMessageFromAdmin from './LiveShoppingCurrentStateMessageFromAdmin';

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

export function useAlarmAudio(): {
  audio: HTMLAudioElement | null;
  playAudio: () => void;
} {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  useEffect(() => {
    setAudio(new Audio('/audio/fever.mp3'));
  }, []);

  const playAudio = (): void => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.play();
    }
  };
  return { audio, playAudio };
}

export interface LiveShoppingCurrentStateBoardProps {
  liveShoppingId: number;
  title: string;
  isOnAir: boolean;
}

export function LiveShoppingCurrentStateBoard({
  liveShoppingId,
  title,
  isOnAir,
}: LiveShoppingCurrentStateBoardProps): JSX.Element {
  // * 관리자 새 메시지
  const [hasAdminAlarm, setHasAdminAlarm] = useState(false);

  // * 응원메시지 데이터
  const { data, status, error, isFetching } = usePurchaseMessages({
    liveShoppingId,
    refetchInterval: isOnAir ? 10 * 1000 : undefined, // 방송진행중인 경우에만 10초에 한번
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
      <LiveShoppingCurrentStateMessageFromAdmin />

      {/* 라이브 상황판 */}
      <Box border="1px" p={4}>
        <Text>라이브 상황판</Text>
        <Text>결제금액 : {totalPrice.toLocaleString()} 원</Text>
        <Text>주문건수 : {totalPurchaseCount} 건</Text>
        <Text>선물건수 : {totalGiftCount} 건</Text>
      </Box>

      {/* 응원메시지 목록 */}
      <Box border="1px" p={4}>
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
