import { Badge } from '@chakra-ui/react';
import {
  convertFmReturnStatusToString,
  fmOrderRefundStatses,
  getFmReturnStatusColor,
} from '@project-lc/shared-types';

export interface FmReturnStatusBadgeProps {
  returnStatus: keyof typeof fmOrderRefundStatses;
}
export function FmReturnStatusBadge({
  returnStatus,
}: FmReturnStatusBadgeProps): JSX.Element {
  return (
    <Badge colorScheme={getFmReturnStatusColor(returnStatus)} variant="outline">
      {convertFmReturnStatusToString(returnStatus)}
    </Badge>
  );
}

export default FmReturnStatusBadge;
