import { useDisclosure, Box, Stack, Link, Button, Text } from '@chakra-ui/react';
import TextDotConnector from '@project-lc/components-core/TextDotConnector';
import { ExchangeReturnCancelRequestStatusBadge } from '@project-lc/components-shared/order/ExchangeReturnCancelRequestStatusBadge';
import { ExchangeDataWithImages } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import OrderExchangeStatusDialog from './OrderExchangeStatusDialog';

export interface OrderDetailExchangeInfoProps {
  exchangeData: ExchangeDataWithImages;
}

const EXCHANGE_TEXT = '교환(재배송)';

export function OrderDetailExchangeInfo({
  exchangeData,
}: OrderDetailExchangeInfoProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
            .map((item) => item.amount)
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
        <Box>
          <Button size="sm" onClick={onOpen}>
            {EXCHANGE_TEXT} 상태 관리
          </Button>
        </Box>
      </Stack>

      <OrderExchangeStatusDialog isOpen={isOpen} onClose={onClose} data={exchangeData} />
    </Box>
  );
}

export default OrderDetailExchangeInfo;
