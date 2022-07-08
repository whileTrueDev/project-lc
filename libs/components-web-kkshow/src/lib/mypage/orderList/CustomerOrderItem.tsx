import { Stack } from '@chakra-ui/react';
import { OrderDataWithRelations, OrderItemWithRelations } from '@project-lc/shared-types';
import { OrderItemActionButtons } from './CustomerOrderItemActionButtons';
import { OrderItemOptionInfo } from './OrderItemOptionInfo';

export function OrderItem({
  orderItem,
  order,
}: {
  orderItem: OrderItemWithRelations;
  order: OrderDataWithRelations;
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
          <OrderItemOptionInfo option={opt} orderItem={orderItem} order={order} />
          {/* 기능버튼들 */}
          <OrderItemActionButtons option={opt} orderItem={orderItem} order={order} />
        </Stack>
      ))}
    </>
  );
}
