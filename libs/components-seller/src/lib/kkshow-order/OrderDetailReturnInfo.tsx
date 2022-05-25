import { Box, Button, Link, Stack, Text, useDisclosure } from '@chakra-ui/react';
import TextDotConnector from '@project-lc/components-core/TextDotConnector';
import { ExchangeReturnCancelRequestStatusBadge } from '@project-lc/components-shared/order/ExchangeReturnCancelRequestStatusBadge';
import { ReturnDataWithImages } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import OrderReturnStatusDialog from './OrderReturnStatusDialog';

export interface OrderDetailReturnInfoProps {
  returnData: ReturnDataWithImages;
}
export function OrderDetailReturnInfo({
  returnData,
}: OrderDetailReturnInfoProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box>
      <Stack direction="row" alignItems="center" my={2} spacing={1.5}>
        <Link isTruncated fontWeight="bold" textDecoration="underline">
          {returnData.returnCode}
        </Link>
        <ExchangeReturnCancelRequestStatusBadge
          status={returnData.status}
          prefix="반품"
        />
        <TextDotConnector />
        <Text isTruncated>
          {returnData.items.map((item) => item.amount).reduce((sum, cur) => sum + cur, 0)}{' '}
          개
        </Text>
      </Stack>

      <Stack>
        <Text>
          (반품요청일) {dayjs(returnData.requestDate).format('YYYY년 MM월 DD일 HH:mm:ss')}
        </Text>
        {returnData.completeDate && (
          <Text>
            (반품완료일){' '}
            {dayjs(returnData.completeDate).format('YYYY년 MM월 DD일 HH:mm:ss')}
          </Text>
        )}
        <Box>
          <Button size="sm" onClick={onOpen}>
            반품 상태 관리
          </Button>
        </Box>
      </Stack>

      <OrderReturnStatusDialog isOpen={isOpen} onClose={onClose} data={returnData} />
    </Box>
  );
}

export default OrderDetailReturnInfo;
