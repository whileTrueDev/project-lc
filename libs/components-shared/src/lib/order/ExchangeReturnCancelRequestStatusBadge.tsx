/** 교환,환불,주문취소 요청 처리상태 배지 */

import { Badge } from '@chakra-ui/react';
import { ExchangeProcessStatus } from '@prisma/client';
import { processTextDict } from '@project-lc/shared-types';

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
    <Badge colorScheme={processTextDict[status].color} variant="solid">
      {prefix}
      {processTextDict[status].name}
      {suffix}
    </Badge>
  );
}
