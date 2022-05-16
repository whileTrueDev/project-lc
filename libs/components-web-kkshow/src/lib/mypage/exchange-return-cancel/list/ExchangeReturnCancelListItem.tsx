import { Badge, Box, Button, Stack, Text } from '@chakra-ui/react';
import { ExchangeProcessStatus } from '@prisma/client';
import TextDotConnector from '@project-lc/components-core/TextDotConnector';
import {
  CancelListItem,
  ExchangeListItem,
  ExchangeReturnCancelItemBaseData,
  processTextDict,
  ReturnListItem,
} from '@project-lc/shared-types';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';

export type ExchangeReturnCancelListItemProps =
  | ExchangeListItem
  | ReturnListItem
  | CancelListItem;

export function ExchangeReturnCancelListItem({
  type,
  data,
}: ExchangeReturnCancelListItemProps): JSX.Element {
  const router = useRouter();
  let identifierCode: string | null = '';
  if (type === 'cancel') identifierCode = data.cancelCode;
  if (type === 'exchange') identifierCode = data.exchangeCode;
  if (type === 'return') identifierCode = data.returnCode;

  const requestDate = dayjs(data.requestDate).format('YYYY-MM-DD');
  const completeDate = data.completeDate
    ? dayjs(data.completeDate).format('YYYY-MM-DD')
    : '';

  const showDetail = (): void => {
    router.push(`/mypage/exchange-return-cancel/${type}/${identifierCode}`);
  };

  return (
    <Stack borderWidth="1px" borderRadius="md" px={4} py={1} boxShadow="md">
      {/* 모바일인 경우 */}
      <Box display={{ base: 'block', md: 'none' }}>
        <Stack>
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="row">
              <Text>고유코드 : </Text>
              <Text fontWeight="bold">{identifierCode}</Text>
            </Stack>

            <Button size="xs" onClick={showDetail}>
              상세보기
            </Button>
          </Stack>

          <Stack>
            {data.items.map((item) => (
              <ExchangeReturnCancelRequestGoodsData key={item.id} {...item} />
            ))}
          </Stack>
          <Box>
            <Stack direction="row">
              <Text>상태 :</Text>
              <ExchangeReturnCancelRequestStatusBadge status={data.status} />
            </Stack>

            <Text>요청일 : {requestDate}</Text>
            {completeDate && <Text>완료일 : {completeDate}</Text>}
          </Box>
        </Stack>
      </Box>
      {/* 데스크탑인 경우 */}
      <Box display={{ base: 'none', md: 'block' }}>
        <Stack direction="row">
          <Box width="10%">
            <Text>{requestDate}</Text>
          </Box>

          <Box width="15%">
            <Text>{identifierCode}</Text>
          </Box>

          <Box width="40%">
            {data.items.map((item) => (
              <ExchangeReturnCancelRequestGoodsData key={item.id} {...item} />
            ))}
          </Box>

          <Box width="15%">
            <Text>{completeDate}</Text>
          </Box>

          <Box width="15%">
            <ExchangeReturnCancelRequestStatusBadge status={data.status} />
            <Button size="xs" onClick={showDetail}>
              상세보기
            </Button>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}
export function DesktopExchangeReturnCancelListHeader(): JSX.Element {
  return (
    <Stack direction="row" px={4}>
      <Box width="10%">
        <Text>신청일</Text>
      </Box>

      <Box width="15%">
        <Text>고유코드</Text>
      </Box>

      <Box width="40%">
        <Text>상품정보</Text>
      </Box>

      <Box width="15%">
        <Text>완료일</Text>
      </Box>

      <Box width="15%">
        <Text>상태</Text>
      </Box>
    </Stack>
  );
}

/** 교환,환불,주문취소 요청 처리상태 배지 */
export function ExchangeReturnCancelRequestStatusBadge({
  status,
  prefix,
  suffix,
}: {
  status: ExchangeProcessStatus;
  prefix?: string;
  suffix?: string;
}): JSX.Element {
  return (
    <Box>
      <Badge colorScheme={processTextDict[status].color} variant="solid">
        {prefix}
        {processTextDict[status].name}
        {suffix}
      </Badge>
    </Box>
  );
}
interface ExchangeReturnCancelRequestGoodsDataProps
  extends ExchangeReturnCancelItemBaseData {
  amount: number;
}
/** 교환,환불,주문취소 상품 & 옵션 & 개수 표시 컴포넌트 */
export function ExchangeReturnCancelRequestGoodsData(
  props: ExchangeReturnCancelRequestGoodsDataProps,
): JSX.Element {
  const { goodsName, image, optionName, optionValue, amount, price } = props;
  return (
    <Stack direction="row" alignItems="center">
      <Box>
        {/* 이미지 */}
        <img width="40px" height="40px" src={image} alt="" />
      </Box>
      {/* 주문상품 옵션 */}
      <Stack>
        <Text fontWeight="bold">{goodsName}</Text>
        <Stack direction="row">
          <Text>
            {optionName} : {optionValue}
          </Text>
          <TextDotConnector />
          <Text>{amount} 개 </Text>
          <TextDotConnector />
          <Text>{getLocaleNumber(price)}원</Text>
        </Stack>
      </Stack>
    </Stack>
  );
}
