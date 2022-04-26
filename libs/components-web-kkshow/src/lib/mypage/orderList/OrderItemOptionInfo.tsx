import { Box, Stack, Text } from '@chakra-ui/react';
import { Goods, GoodsImages, OrderItemOption } from '@prisma/client';
import { TextDotConnector } from '@project-lc/components-core/TextDotConnector';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import { OrderStatusBadge } from './CustomerOrderItem';

export interface OrderItemOptionInfoProps {
  option: OrderItemOption;
  goodsName: Goods['goods_name'];
  goodsImage: GoodsImages['image'];
  displayStatus?: boolean;
}
export function OrderItemOptionInfo({
  option,
  goodsName,
  goodsImage,
  displayStatus = true,
}: OrderItemOptionInfoProps): JSX.Element {
  return (
    <Stack direction="row" alignItems="center">
      <Box>
        {/* 이미지 */}
        <img width="40px" height="40px" src={goodsImage} alt="" />
      </Box>
      {/* 주문상품 옵션 */}
      <Stack>
        {displayStatus && (
          <OrderStatusBadge
            step={option.step}
            purchaseConfirmed={!!option.purchaseConfirmationDate}
          />
        )}

        <Text fontWeight="bold">{goodsName}</Text>
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
