import { Badge } from '@chakra-ui/react';
import { ProcessStatus } from '@prisma/client';
import {
  convertProcessStatusToString,
  getProcessStatusColor,
} from '@project-lc/shared-types';

export interface ProcessStatusBadgeProps {
  processStatus: ProcessStatus;
}
export function ProcessStatusBadge({
  processStatus,
}: ProcessStatusBadgeProps): JSX.Element {
  return (
    <Badge colorScheme={getProcessStatusColor(processStatus)} variant="outline">
      {convertProcessStatusToString(processStatus)}
    </Badge>
  );
}

export default ProcessStatusBadge;
