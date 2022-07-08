import { Badge, Box } from '@chakra-ui/react';
import { OrderProcessStep } from '@prisma/client';
import { getOrderStatusColor, getOrderStatusKrString } from '@project-lc/shared-types';

export function OrderStatusBadge({ step }: { step: OrderProcessStep }): JSX.Element {
  return (
    <Box>
      <Badge colorScheme={getOrderStatusColor(step)} variant="solid">
        {getOrderStatusKrString(step)}
      </Badge>
    </Box>
  );
}
