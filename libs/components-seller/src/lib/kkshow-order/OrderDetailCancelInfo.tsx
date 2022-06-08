import { useDisclosure, Box, Stack, Link, Button, Text } from '@chakra-ui/react';
import TextDotConnector from '@project-lc/components-core/TextDotConnector';
import { ExchangeReturnCancelRequestStatusBadge } from '@project-lc/components-shared/order/ExchangeReturnCancelRequestStatusBadge';
import { OrderCancellationBaseData } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import OrderCancelStatusDialog from './OrderCancelStatusDialog';

export interface OrderDetailCancelInfoProps {
  cancelData: OrderCancellationBaseData;
}
export function OrderDetailCancelInfo({
  cancelData,
}: OrderDetailCancelInfoProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box>
      <Stack direction="row" alignItems="center" my={2} spacing={1.5}>
        <Link isTruncated fontWeight="bold" textDecoration="underline">
          {cancelData.cancelCode}
        </Link>
        <ExchangeReturnCancelRequestStatusBadge
          status={cancelData.status}
          prefix="주문취소 "
        />
        <TextDotConnector />
        <Text isTruncated>
          {cancelData.items.map((item) => item.amount).reduce((sum, cur) => sum + cur, 0)}
          개
        </Text>
      </Stack>

      <Stack>
        <Text>
          (주문취소 요청일){' '}
          {dayjs(cancelData.requestDate).format('YYYY년 MM월 DD일 HH:mm:ss')}
        </Text>
        {cancelData.completeDate && (
          <Text>
            (처리 완료일){' '}
            {dayjs(cancelData.completeDate).format('YYYY년 MM월 DD일 HH:mm:ss')}
          </Text>
        )}
        <Box>
          <Button size="sm" onClick={onOpen}>
            주문취소 상태 관리
          </Button>
        </Box>
      </Stack>

      <OrderCancelStatusDialog isOpen={isOpen} onClose={onClose} data={cancelData} />
    </Box>
  );
}

export default OrderDetailCancelInfo;
