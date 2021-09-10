import { Badge, BadgeProps } from '@chakra-ui/react';
import {
  convertFmOrderStatusToString,
  fmOrderStatuses,
  getFmOrderStatusColor,
} from '@project-lc/shared-types';

export interface FmOrderStatusBadgeProps {
  orderStatus: keyof typeof fmOrderStatuses;
}
export function FmOrderStatusBadge({
  orderStatus,
}: FmOrderStatusBadgeProps): JSX.Element {
  return (
    <Badge colorScheme={getFmOrderStatusColor(orderStatus)} variant="solid">
      {convertFmOrderStatusToString(orderStatus)}
    </Badge>
  );
}

export default FmOrderStatusBadge;
