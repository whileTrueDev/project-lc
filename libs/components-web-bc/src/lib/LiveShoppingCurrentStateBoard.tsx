import { Box, Grid, GridItem, Heading, Stack, Text } from '@chakra-ui/react';
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
import { SectionWithTitle } from '@project-lc/components-layout/SectionWithTitle';

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
      <Stack h="100vh" p={4}>
        {/* 라이브쇼핑명 - 제목 */}
        <Heading textAlign="center">{title}</Heading>

        {/* 관리자메시지 */}
        <SectionWithTitle variant="outlined" title="관리자 메시지">
          {adminMessageData?.text || '없음'}
        </SectionWithTitle>

        {/* 라이브 상황판 */}
        <SectionWithTitle variant="outlined" title="라이브 상황판">
          <Stack direction="row" justifyContent="space-around">
            <StateItem name="결제금액" value={`${totalPrice.toLocaleString()} 원`} />
            <StateItem name="주문건수" value={`${totalPurchaseCount} 건`} />
            <StateItem name="선물건수" value={`${totalGiftCount} 건`} />
          </Stack>
        </SectionWithTitle>

        {/* 응원메시지 목록 */}
        <SectionWithTitle variant="outlined" title="응원메시지">
          <Box maxH={200} overflowY="auto">
            <MessageItemLayout
              bg="blue.500"
              color="white"
              item={{
                index: '순서',
                nickname: '닉네임',
                message: '응원메시지',
                price: '주문금액',
              }}
            />

            {data &&
              data.map((d, index) => (
                <PurchaseMessageItem item={d} index={data.length - index} key={d.id} />
              ))}
          </Box>
        </SectionWithTitle>
      </Stack>
    </MotionBox>
  );
}
export default LiveShoppingCurrentStateBoard;

export function MessageItemLayout({
  item,
  bg,
  color,
}: {
  item: {
    index: string;
    nickname: string;
    message: string;
    price: string;
  };
  bg?: string;
  color?: string;
}): JSX.Element {
  const { index, nickname, message, price } = item;
  return (
    <Grid templateColumns="repeat(6, 1fr)" w="100%" gap={1} mb={1}>
      <GridItem colSpan={1} h="2rem" bg={bg} color={color} px={2} textAlign="center">
        {index}
      </GridItem>
      <GridItem colSpan={1} h="2rem" bg={bg} color={color} px={2}>
        {nickname}
      </GridItem>
      <GridItem colSpan={3} h="2rem" bg={bg} color={color} px={2}>
        {message}
      </GridItem>
      <GridItem colSpan={1} h="2rem" bg={bg} color={color} px={2}>
        {price}
      </GridItem>
    </Grid>
  );
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
    <MessageItemLayout
      item={{
        index: index.toString(),
        nickname,
        message: `${giftFlag ? '(선물)' : ''} ${text}`,
        price: `${price.toLocaleString()}원`,
      }}
      bg={index % 2 === 0 ? 'teal.50' : 'gray.50'}
    />
  );
}

export function StateItem({ name, value }: { name: string; value: string }): JSX.Element {
  return (
    <Stack alignItems="center">
      <Text>{name}</Text>
      <Text fontSize="xl" fontWeight="bold">
        {value}
      </Text>
    </Stack>
  );
}
