import { Box } from '@chakra-ui/react';
import { OrderProcessStep } from '@prisma/client';
import { FmOrderStatusNumString, orderProcessStepDict } from '@project-lc/shared-types';
import FmOrderStatusBadge from '../FmOrderStatusBadge';

export function orderProcessStepToFmOrderStatus(
  step: OrderProcessStep,
): FmOrderStatusNumString {
  return orderProcessStepDict[step];
}
/** FmOrderStatusBadge 래핑한 컴포넌트 */
export function OrderStatusBadge({ step }: { step: OrderProcessStep }): JSX.Element {
  return (
    <Box>
      <FmOrderStatusBadge orderStatus={orderProcessStepToFmOrderStatus(step)} />
    </Box>
  );
}
