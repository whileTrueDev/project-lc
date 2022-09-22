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
import { useLiveShoppingStateSubscription, usePurchaseMessages } from '@project-lc/hooks';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import { AnimationDefinition } from 'framer-motion/types/render/utils/animation';
import { useCallback, useMemo } from 'react';

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
  const { message, alert, setAlert, requestOutroPlay } =
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

  const handleLiveShoppingClose = (): void => {
    console.log('컨트롤러로 종료요청 이벤트 emit');
    requestOutroPlay();
  };

  const closeButtonDisabled = false;

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

        {/* 라이브쇼핑 종료 버튼  // TODO : 종료시간 10초전 활성화 */}
        <Box>
          <Button onClick={handleLiveShoppingClose} disabled={closeButtonDisabled}>
            라이브 종료
          </Button>
          <Text color="GrayText" size="sm" as="span">
            라이브쇼핑 종료 10초 전 활성화
          </Text>
          {broadcastEndDate}
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
