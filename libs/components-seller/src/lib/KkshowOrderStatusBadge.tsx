import { Badge } from '@chakra-ui/react';
import {
  orderProcessStepKoreanDict,
  kkshowOrderStatuses,
} from '@project-lc/shared-types';

export interface KkshowOrderStatusBadgeProps {
  orderStatus: keyof typeof kkshowOrderStatuses;
}
export function KkshowOrderStatusBadge({
  orderStatus,
}: KkshowOrderStatusBadgeProps): JSX.Element {
  return (
    <Badge colorScheme={kkshowOrderStatuses[orderStatus].chakraColor} variant="solid">
      {orderProcessStepKoreanDict[orderStatus]}
    </Badge>
  );
}
export default KkshowOrderStatusBadge;
