import { Badge } from '@chakra-ui/react';
import {
  convertFmOrderStatusToString,
  fmOrderStatuses,
  getFmOrderStatusColor,
  orderProcessStepKoreanDict,
  kkshowOrderStatuses,
  KkshowOrderStatusExtended,
} from '@project-lc/shared-types';
import { OrderItemOption, OrderProcessStep } from '@prisma/client';

export interface KkshowOrderStatusBadgeProps {
  orderStatus: keyof typeof kkshowOrderStatuses;
}
export function FmOrderStatusBadge({
  orderStatus,
}: KkshowOrderStatusBadgeProps): JSX.Element {
  return (
    <Badge colorScheme={kkshowOrderStatuses[orderStatus].chakraColor} variant="solid">
      {orderProcessStepKoreanDict[orderStatus]}
    </Badge>
  );
}
export default FmOrderStatusBadge;
