import { Badge, Box } from '@chakra-ui/react';
import { ProcessStatus } from '@prisma/client';

type OrderCancelStatusValues = { name: string; color: string };
const orderCancelStatusDict: Record<ProcessStatus, OrderCancelStatusValues> = {
  requested: { name: '주문취소 요청함', color: 'orange' }, // 요청됨(초기 상태, 담당자 확인전)
  processing: { name: '주문취소 처리중', color: 'yellow' }, // 처리진행중(담당자 확인 후 처리 중)
  complete: { name: '주문취소 처리완료', color: 'green' }, // 처리완료
  canceled: { name: '주문취소 취소됨', color: 'grey' }, // 취소됨(거절됨 포함)
};

export function OrderCancelStatusBadge({
  status,
}: {
  status: ProcessStatus;
}): JSX.Element {
  return (
    <Box>
      <Badge colorScheme={orderCancelStatusDict[status].color} variant="solid">
        {orderCancelStatusDict[status].name}
      </Badge>
    </Box>
  );
}

export default OrderCancelStatusBadge;
