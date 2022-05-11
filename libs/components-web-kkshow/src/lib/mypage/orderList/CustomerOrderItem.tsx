import { Box, Stack } from '@chakra-ui/react';
import { OrderProcessStep } from '@prisma/client';
import FmOrderStatusBadge from '@project-lc/components-shared/FmOrderStatusBadge';
import {
  FmOrderStatusNumString,
  OrderItemWithRelations,
  orderProcessStepDict,
} from '@project-lc/shared-types';
import { OrderItemActionButtons } from './CustomerOrderItemActionButtons';
import { OrderItemOptionInfo } from './OrderItemOptionInfo';

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

export function OrderItem({
  orderItem,
}: {
  orderItem: OrderItemWithRelations;
}): JSX.Element {
  return (
    <>
      {/* 주문상품옵션 1개당 주문목록아이템 1개 생성 */}
      {orderItem.options.map((opt) => (
        <Stack
          key={opt.id}
          borderWidth="1px"
          borderRadius="md"
          p={1}
          direction={{ base: 'column', sm: 'row' }}
          justifyContent="space-between"
        >
          {/* 주문상품정보 */}
          <OrderItemOptionInfo option={opt} orderItem={orderItem} />
          {/* 기능버튼들 */}
          <OrderItemActionButtons option={opt} orderItem={orderItem} />
        </Stack>
      ))}
    </>
  );
}
