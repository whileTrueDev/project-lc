import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { LiveShoppingPurchaseMessage } from '@prisma/client';
import MotionBox from '@project-lc/components-core/MotionBox';
import { SectionWithTitle } from '@project-lc/components-layout/SectionWithTitle';
import {
  LIVE_SHOPPING_END_TIME_KEY,
  useCountdown,
  useLiveShoppingStateSubscription,
  usePurchaseMessages,
} from '@project-lc/hooks';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import dayjs from 'dayjs';
import { AnimationDefinition } from 'framer-motion/types/render/utils/animation';
import { useCallback, useEffect, useMemo, useState } from 'react';

export interface LiveShoppingCurrentStateBoardProps {
  liveShoppingId: number;
  broadcastEndDate?: Date | null;
  title: string;
}

export function LiveShoppingCurrentStateBoard({
  liveShoppingId,
  title,
  broadcastEndDate,
}: LiveShoppingCurrentStateBoardProps): JSX.Element {
  const { message, alert, setAlert, requestOutroPlay, endTimeFromSocketServer } =
    useLiveShoppingStateSubscription(liveShoppingId);

  // * 후원메시지 데이터
  const { data, status, error } = usePurchaseMessages({
    liveShoppingId,
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
  const hasAlert = alert;

  // * 관리자 알림 도착으로 애니메이션 끝난 후 콜백함수 -> 관리자 알림여부 false로 설정
  const onAminationCompleteHandler = useCallback(
    (def: AnimationDefinition) => {
      if (def === 'visible') {
        setAlert(false);
      }
    },
    [setAlert],
  );

  const bg = useColorModeValue('rgba(255,255,255,1)', '#1A202C');
  const alertColor = 'rgba(255,0,0,1)';
  const fontColor = 'white';

  // 관리자 알림 있는경우 애니메이션 위한 variants
  const variants = {
    default: {
      backgroundColor: bg,
    },
    visible: {
      backgroundColor: [alertColor, bg, alertColor, bg, alertColor, bg],
      transition: {
        duration: 2,
      },
    },
  };

  const handleLiveShoppingClose = useCallback((): void => {
    requestOutroPlay();
  }, [requestOutroPlay]);

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

        {/* 라이브쇼핑 종료 버튼  */}
        <Box>
          <LiveShoppingEndButton
            onClick={handleLiveShoppingClose}
            broadcastEndDate={broadcastEndDate}
            endTimeFromSocketServer={endTimeFromSocketServer}
            liveShoppingId={liveShoppingId}
          />
        </Box>

        {/* 관리자메시지 */}
        <SectionWithTitle variant="outlined" title="관리자 메시지">
          {message || '없음'}
        </SectionWithTitle>

        {/* 라이브 상황판 */}
        <SectionWithTitle variant="outlined" title="라이브 상황판">
          <Stack direction="row" justifyContent="space-around">
            <StateItem name="결제금액" value={`${getLocaleNumber(totalPrice)} 원`} />
            <StateItem name="주문건수" value={`${totalPurchaseCount} 건`} />
            <StateItem name="선물건수" value={`${totalGiftCount} 건`} />
          </Stack>
        </SectionWithTitle>

        {/* 후원메시지 목록 */}
        <SectionWithTitle variant="outlined" title="후원메시지">
          <Box maxH="400px" overflowY="auto">
            <MessageItemLayout
              bg="blue.500"
              color={fontColor}
              item={{
                index: '순서',
                nickname: '닉네임',
                message: '후원메시지',
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
      <GridItem colSpan={1} h="2rem" bg={bg} color={color} px={2} isTruncated>
        {nickname}
      </GridItem>
      <GridItem colSpan={3} h="2rem" bg={bg} color={color} px={2} isTruncated>
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
  const { nickname, text, price } = item;
  const evenBg = useColorModeValue('teal.50', 'teal.800');
  const oddBg = useColorModeValue('gray.50', 'gray.700');
  const color = useColorModeValue('gray.800', 'white');
  return (
    <MessageItemLayout
      item={{
        index: index.toString(),
        nickname,
        message: text,
        price: `${getLocaleNumber(price)}원`,
      }}
      bg={index % 2 === 0 ? evenBg : oddBg}
      color={color}
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

/** 컨트롤러에서 전송받아 로컬스토리지에 저장해둔 라이브쇼핑 종료시간 찾기 */
function findSavedLiveShoppingEndTime(liveShoppingId: number): Date | undefined {
  const endTimeLocalStorageData = window.localStorage.getItem(LIVE_SHOPPING_END_TIME_KEY);
  const savedEndTime: Date | undefined =
    endTimeLocalStorageData &&
    JSON.parse(endTimeLocalStorageData)?.liveShoppingId === liveShoppingId
      ? JSON.parse(endTimeLocalStorageData)?.endDateTime
      : undefined;

  return savedEndTime;
}

/** 라이브쇼핑 종료하기 버튼 - 종료시간을 전달받아 카운트다운 타이머를 실행하고, 남은 방송시간에 따라 버튼 disabled 여부를 결정한다 */
function LiveShoppingEndButton({
  onClick,
  broadcastEndDate,
  endTimeFromSocketServer,
  liveShoppingId,
}: {
  onClick: () => void;
  liveShoppingId: number;
  broadcastEndDate?: Date | null;
  endTimeFromSocketServer: string | undefined;
}): JSX.Element {
  const [outroButtonDisabled, setOutroButtonDisabled] = useState<boolean>(true);

  const { startCountdown, clearTimer, seconds } = useCountdown();

  // 방송종료시간이 변경되는 경우 남은방송시간 계산 타이머 재설정
  useEffect(() => {
    // 종료시간 변경될때마다 outroButtonDisabled값을 true(버튼 비활성화)로 초기화한다
    setOutroButtonDisabled(true);

    /**
     * 방송 종료시간 가져오기
     * 1. 컨트롤러에서 전송받은 종료시간(컨트롤러에서 전송하지 않으면 존재하지 않음)
     * 2. 로컬스토리지에 저장된, 컨트롤러에서 전송받은 종료시간(현황판 새로고침하면 값이 사라져서 로컬스토리지에 저장해둠)
     * 3. 컨트롤러에서 종료시간 전송받지 않은 경우 라이브쇼핑에 저장된 종료시간
     * 4. 아무 값도 없는경우 현재를 종료시간으로 설정하여 타이머 작동 안시킴
     */
    const savedEndTime = findSavedLiveShoppingEndTime(liveShoppingId);
    const now = new Date();
    const realEndTime = dayjs(
      endTimeFromSocketServer || savedEndTime || broadcastEndDate || now,
    );

    // 방송종료시간 - 현재시간 = 남은 방송 시간(초)로 카운트다운 타이머 실행
    const remainingBroadcastSeconds = realEndTime.diff(now, 'second');
    startCountdown(remainingBroadcastSeconds);
  }, [
    broadcastEndDate,
    clearTimer,
    endTimeFromSocketServer,
    liveShoppingId,
    startCountdown,
  ]);

  // 남은 방송시간이 10초 이하인 경우 버튼 활성화
  useEffect(() => {
    if (seconds <= 10) {
      setOutroButtonDisabled(false);
    }
  }, [seconds, clearTimer]);

  return (
    <Button
      onClick={onClick}
      disabled={outroButtonDisabled}
      colorScheme={outroButtonDisabled ? undefined : 'red'}
    >
      라이브 종료하기
      {outroButtonDisabled && <Text>(라이브방송 종료시간 10초 전 활성화됩니다)</Text>}
    </Button>
  );
}
