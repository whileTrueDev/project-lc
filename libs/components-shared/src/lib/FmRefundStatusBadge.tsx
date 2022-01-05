import { Badge } from '@chakra-ui/react';
import {
  convertFmRefundStatusToString,
  fmOrderRefundStatses,
  getFmRefundStatusColor,
} from '@project-lc/shared-types';

export interface FmRefundStatusBadgeProps {
  refundStatus: keyof typeof fmOrderRefundStatses;
}
export function FmRefundStatusBadge({
  refundStatus,
}: FmRefundStatusBadgeProps): JSX.Element {
  return (
    <Badge colorScheme={getFmRefundStatusColor(refundStatus)} variant="outline">
      {convertFmRefundStatusToString(refundStatus)}
    </Badge>
  );
}

export default FmRefundStatusBadge;
