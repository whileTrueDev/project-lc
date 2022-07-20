import { useDisclosure, Box, Stack, Link, Button, Text } from '@chakra-ui/react';
import TextDotConnector from '@project-lc/components-core/TextDotConnector';
import { ExchangeReturnCancelRequestStatusBadge } from '@project-lc/components-shared/order/ExchangeReturnCancelRequestStatusBadge';
import { ExchangeDataWithImages, OrderDetailRes } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import OrderExchangeStatusDialog from './OrderExchangeStatusDialog';
import ReExportDialog from './ReExportDialog';

export interface OrderDetailExchangeInfoProps {
  exchangeData: ExchangeDataWithImages;
  order: OrderDetailRes;
}

const EXCHANGE_TEXT = '교환(재배송)';

export function OrderDetailExchangeInfo({
  exchangeData,
  order,
}: OrderDetailExchangeInfoProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const reExportDialog = useDisclosure();
  return (
    <Box>
      <Stack direction="row" alignItems="center" my={2} spacing={1.5}>
        <Link isTruncated fontWeight="bold" textDecoration="underline">
          {exchangeData.exchangeCode}
        </Link>
        <ExchangeReturnCancelRequestStatusBadge
          status={exchangeData.status}
          prefix={EXCHANGE_TEXT}
        />
        <TextDotConnector />
        <Text isTruncated>
          {exchangeData.exchangeItems
            .map((item) => item.quantity)
            .reduce((sum, cur) => sum + cur, 0)}{' '}
          개
        </Text>
      </Stack>

      <Stack>
        <Text>
          ({EXCHANGE_TEXT}요청일){' '}
          {dayjs(exchangeData.requestDate).format('YYYY년 MM월 DD일 HH:mm:ss')}
        </Text>
        {exchangeData.completeDate && (
          <Text>
            ({EXCHANGE_TEXT}완료일){' '}
            {dayjs(exchangeData.completeDate).format('YYYY년 MM월 DD일 HH:mm:ss')}
          </Text>
        )}
        <Stack direction="row" spacing={4}>
          <Button size="sm" onClick={onOpen}>
            {EXCHANGE_TEXT} 상태 관리
          </Button>
          {/* 해당 재배송 요청과 연결된 출고정보(재출고) 없는경우 재출고 처리버튼 노출 */}
          {!exchangeData.exportId && (
            <Button size="sm" onClick={reExportDialog.onOpen}>
              재배송 처리하기
            </Button>
          )}
        </Stack>
      </Stack>

      {/* 재배송 상태관리 다이얼로그 */}
      <OrderExchangeStatusDialog isOpen={isOpen} onClose={onClose} data={exchangeData} />
      {/* 재출고 다이얼로그 */}
      <ReExportDialog
        exchangeData={exchangeData}
        isOpen={reExportDialog.isOpen}
        onClose={reExportDialog.onClose}
        order={order}
      />
    </Box>
  );
}

export default OrderDetailExchangeInfo;
