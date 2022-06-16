import { Badge } from '@chakra-ui/react';
import {
  convertkkshowOrderStatusToString,
  getkkshowOrderStatusColor,
  kkshowOrderStatuses,
} from '@project-lc/shared-types';

export interface KkshowOrderStatusBadgeProps {
  orderStatus: keyof typeof kkshowOrderStatuses;
}
export function KkshowOrderStatusBadge({
  orderStatus,
}: KkshowOrderStatusBadgeProps): JSX.Element {
  return (
    <Badge colorScheme={getkkshowOrderStatusColor(orderStatus)} variant="solid">
      {convertkkshowOrderStatusToString(orderStatus)}
    </Badge>
  );
}
export default KkshowOrderStatusBadge;
