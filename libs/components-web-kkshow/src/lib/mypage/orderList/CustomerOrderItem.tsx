import { Box, Stack, Badge } from '@chakra-ui/react';
import { OrderProcessStep } from '@prisma/client';
import FmOrderStatusBadge from '@project-lc/components-shared/FmOrderStatusBadge';
import { FmOrderStatusNumString, OrderItemWithRelations } from '@project-lc/shared-types';
import { OrderItemActionButtons } from './CustomerOrderItemActionButtons';
import { OrderItemOptionInfo } from './OrderItemOptionInfo';

export const orderProcessStepDict: Record<OrderProcessStep, FmOrderStatusNumString> = {
  orderReceived: '15', // 주문접수,
  paymentConfirmed: '25', // 결제확인,
  goodsReady: '35', // 상품준비,
  partialExportReady: '40', // 부분출고준비,
  exportReady: '45', // 출고준비,
  partialExportDone: '50', // 부분출고완료,
  exportDone: '55', // 출고완료,
  partialShipping: '60', // 부분배송중,
  shipping: '65', // 배송중,
  partialShippingDone: '70', // 부분배송완료,
  shippingDone: '75', // 배송완료,
  paymentCanceled: '85', // 결제취소,
  orderInvalidated: '95', // 주문무효,
  paymentFailed: '99', // 결제실패,
};
export function orderProcessStepToFmOrderStatus(
  step: OrderProcessStep,
): FmOrderStatusNumString {
  return orderProcessStepDict[step];
}
/** FmOrderStatusBadge 래핑한 컴포넌트 => FmOrderStatusBadge에는 구매확정이 없어서 별도로 렌더링함 */
export function OrderStatusBadge({
  step,
  purchaseConfirmed,
}: {
  step: OrderProcessStep;
  purchaseConfirmed?: boolean;
}): JSX.Element {
  if (purchaseConfirmed)
    return (
      <Box>
        <Badge colorScheme="orange" variant="solid">
          구매확정
        </Badge>
      </Box>
    );
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
  const hasReview = !!orderItem.reviewId;

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
          <OrderItemOptionInfo option={opt} goodsData={orderItem.goods} />
          {/* 기능버튼들 */}
          <OrderItemActionButtons
            option={opt}
            goodsData={orderItem.goods}
            hasReview={hasReview}
          />
        </Stack>
      ))}
    </>
  );
}
