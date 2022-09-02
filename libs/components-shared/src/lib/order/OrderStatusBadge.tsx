import { Badge, Box } from '@chakra-ui/react';
import { OrderProcessStep } from '@prisma/client';
import {
  getOrderStatusColor,
  getOrderStatusKrString,
  orderProcessStepKoreanDict,
} from '@project-lc/shared-types';

export function OrderStatusBadge({ step }: { step: OrderProcessStep }): JSX.Element {
  if (['returns', 'refunds', 'exchanges'].includes(step)) {
    return (
      <Box>
        <Badge colorScheme="red" variant="solid">
          {orderProcessStepKoreanDict[step]}
        </Badge>
      </Box>
    );
  }
  return (
    <Box>
      <Badge colorScheme={getOrderStatusColor(step)} variant="solid">
        {getOrderStatusKrString(step)}
      </Badge>
    </Box>
  );
}
