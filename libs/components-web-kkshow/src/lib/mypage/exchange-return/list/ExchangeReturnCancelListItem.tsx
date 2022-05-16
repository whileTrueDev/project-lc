import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { ExchangeProcessStatus } from '@prisma/client';
import TextDotConnector from '@project-lc/components-core/TextDotConnector';
import {
  ExchangeData,
  ExchangeReturnCancelItemBaseData,
  OrderCancellationData,
  ReturnData,
} from '@project-lc/shared-types';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import dayjs from 'dayjs';

export type ExchangeReturnCancelType = 'exchange' | 'return' | 'cancel';
export interface ExchangeReturnCancelListItemBase {
  type: ExchangeReturnCancelType;
}
export interface ExchangeListItem extends ExchangeReturnCancelListItemBase {
  type: 'exchange';
  data: ExchangeData;
}
export interface ReturnListItem extends ExchangeReturnCancelListItemBase {
  type: 'return';
  data: ReturnData;
}
export interface CancelListItem extends ExchangeReturnCancelListItemBase {
  type: 'cancel';
  data: OrderCancellationData;
}

export type ExchangeReturnCancelListItemProps =
  | ExchangeListItem
  | ReturnListItem
  | CancelListItem;

const processTextDict: Record<ExchangeProcessStatus, string> = {
  requested: '요청됨',
  collected: '수거됨',
  processing: '처리진행중',
  complete: '처리완료',
  canceled: '취소됨',
};

export function ExchangeReturnCancelListItem({
  type,
  data,
}: ExchangeReturnCancelListItemProps): JSX.Element {
  let identifierCode: string | null = '';
  if (type === 'cancel') identifierCode = data.cancelCode;
  if (type === 'exchange') identifierCode = data.exchangeCode;
  if (type === 'return') identifierCode = data.returnCode;

  const requestDate = dayjs(data.requestDate).format('YYYY-MM-DD');
  const completeDate = data.completeDate
    ? dayjs(data.completeDate).format('YYYY-MM-DD')
    : '';
  const processText = processTextDict[data.status];

  const showDetail = (): void => {
    console.log({ type, identifierCode, id: data.id });
  };

  return (
    <Stack borderWidth="1px" borderRadius="md" px={4} py={1} boxShadow="md">
      {/* 모바일인 경우 */}
      <Box display={{ base: 'block', md: 'none' }}>
        <Stack>
          <Stack direction="row">
            <Text>{identifierCode}</Text>
            <Button size="sm" onClick={showDetail}>
              상세보기
            </Button>
          </Stack>

          <Stack>
            {data.items.map((item) => (
              <RequestGoodsData key={item.id} {...item} />
            ))}
          </Stack>
          <Text>주문코드 : {data.order.orderCode}</Text>
          <Box>
            <Text>상태 : {processText}</Text>
            <Text>요청일 : {requestDate}</Text>
            <Text>완료일 : {completeDate}</Text>
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
              <RequestGoodsData key={item.id} {...item} />
            ))}
            <Text>주문코드 : {data.order.orderCode}</Text>
          </Box>

          <Box width="15%">
            <Text>{completeDate}</Text>
          </Box>

          <Box width="15%">
            <Text>{processText}</Text>
            <Button size="sm" onClick={showDetail}>
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
interface RequestGoodsDataProps extends ExchangeReturnCancelItemBaseData {
  amount: number;
}
export function RequestGoodsData(props: RequestGoodsDataProps): JSX.Element {
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
