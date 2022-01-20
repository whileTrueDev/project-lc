import { Box, Heading, Stack, Text } from '@chakra-ui/react';
import { LiveShoppingPurchaseMessage } from '@prisma/client';
import MotionBox from '@project-lc/components-core/MotionBox';
import {
  useLiveShoppingStateBoardAdminMessage,
  useLiveShoppingStateBoardAlertDeleteMutation,
  useLiveShoppingStateBoardAlertState,
  usePurchaseMessages,
} from '@project-lc/hooks';
import { AnimationDefinition } from 'framer-motion/types/render/utils/animation';
import { useCallback, useMemo } from 'react';
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

function getRefetchInterval(enable: boolean, time: number): undefined | number {
  return enable ? time : undefined;
}
// 재요청 시간 ms
const FETCH_INTERVAL = {
  purchaseMessage: 10 * 1000,
  adminMessage: 5 * 1000,
  alertData: 5 * 1000,
};

// 관리자 알림 있는경우 애니메이션 위한 variants
const variants = {
  default: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
  visible: {
    backgroundColor: [
      'rgba(255,0,0,1)',
      'rgba(255,255,255,1)',
      'rgba(255,0,0,1)',
      'rgba(255,255,255,1)',
      'rgba(255,0,0,1)',
      'rgba(255,255,255,1)',
    ],
    transition: {
      duration: 2,
    },
  },
};

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
  // * 관리자메시지 데이터
  const { data: adminMessageData } = useLiveShoppingStateBoardAdminMessage({
    liveShoppingId,
    refetchInterval: getRefetchInterval(false, FETCH_INTERVAL.adminMessage), // TODO: isOnAir 전달
  });

  // * 응원메시지 데이터
  const { data, status, error } = usePurchaseMessages({
    liveShoppingId,
    refetchInterval: getRefetchInterval(false, FETCH_INTERVAL.purchaseMessage), // TODO: isOnAir 전달
  });

  const { totalPrice, totalPurchaseCount, totalGiftCount } = useMemo(() => {
    if (!data) return { totalPrice: 0, totalPurchaseCount: 0, totalGiftCount: 0 };
    return {
      totalPrice: data.reduce((acc, d) => acc + d.price, 0),
      totalPurchaseCount: data.length,
      totalGiftCount: data.filter((d) => !!d.giftFlag).length,
    };
  }, [data]);

  // * 관리자 알림
  const { hasAlert, setAlertFalse } = useLiveShoppingStateBoardAlertState({
    liveShoppingId,
    refetchInterval: getRefetchInterval(isOnAir, FETCH_INTERVAL.alertData),
  });

  const deleteAlert = useLiveShoppingStateBoardAlertDeleteMutation();
  // * 관리자 알림 도착으로 애니메이션 끝난 후 콜백함수 -> 관리자 알림 삭제 & 관리자 알림여부 false로 설정
  const onAminationCompleteHandler = useCallback(
    (def: AnimationDefinition) => {
      if (def === 'visible') {
        deleteAlert.mutateAsync({ liveShoppingId }).then(() => {
          setAlertFalse();
        });
      }
    },
    [deleteAlert, liveShoppingId, setAlertFalse],
  );

  if (status === 'loading') return <Box>Loading...</Box>;
  if (status === 'error') {
    console.error(error);
    return (
      <Box>에러가 발생했습니다. 해당 현상이 반복되는경우 고객센터로 문의해주세요.</Box>
    );
  }

  return (
    <MotionBox
      initial="default"
      animate={hasAlert ? 'visible' : 'default'}
      variants={variants}
      onAnimationComplete={onAminationCompleteHandler}
    >
      {/* 라이브쇼핑명 - 제목 */}
      <Heading>{title}</Heading>

      {/* 관리자메시지 */}
      <LiveShoppingCurrentStateMessageFromAdmin message={adminMessageData?.text} />

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
    </MotionBox>
  );
}

export default LiveShoppingCurrentStateBoard;
