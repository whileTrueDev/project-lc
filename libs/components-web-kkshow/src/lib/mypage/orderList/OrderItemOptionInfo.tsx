import { Box, Stack, Text } from '@chakra-ui/react';
import { OrderItemOption } from '@prisma/client';
import { TextDotConnector } from '@project-lc/components-core/TextDotConnector';
import { OrderDataWithRelations, OrderItemWithRelations } from '@project-lc/shared-types';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import { OrderStatusBadge } from '@project-lc/components-shared/order/OrderStatusBadge';

export interface OrderItemOptionInfoProps {
  option: OrderItemOption;
  orderItem: OrderItemWithRelations;
  displayStatus?: boolean;
  order: OrderDataWithRelations;
}
export function OrderItemOptionInfo({
  option,
  orderItem,
  displayStatus = true,
}: OrderItemOptionInfoProps): JSX.Element {
  const goodsId = orderItem.goods.id;
  const goodsName = orderItem.goods.goods_name;
  const goodsImage = orderItem.goods.image?.[0]?.image;
  return (
    <Stack direction="row" alignItems="center">
      <Box
        cursor="pointer"
        onClick={() => {
          alert(`상품고유번호 ${goodsId}의 상세페이지로 이동`);
        }}
      >
        {/* 이미지 */}
        <img width="40px" height="40px" src={goodsImage} alt="" />
      </Box>
      {/* 주문상품 옵션 */}
      <Stack>
        {displayStatus && (
          <Stack direction="row">
            <OrderStatusBadge step={option.step} />
          </Stack>
        )}

        <Text
          fontWeight="bold"
          cursor="pointer"
          onClick={() => {
            alert(`상품고유번호 ${goodsId}의 상세페이지로 이동`);
          }}
        >
          {goodsName}
        </Text>
        <Stack direction="row">
          <Text>
            {option.name} : {option.value}
          </Text>
          <TextDotConnector />
          <Text>{option.quantity} 개 </Text>
          <TextDotConnector />
          <Text>{getLocaleNumber(option.discountPrice)}원</Text>
        </Stack>
      </Stack>
    </Stack>
  );
}
