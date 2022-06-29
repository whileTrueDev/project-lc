import { Box, Image, Stack, Text } from '@chakra-ui/react';
import { OrderItemOption } from '@prisma/client';
import { TextDotConnector } from '@project-lc/components-core/TextDotConnector';
import { OrderDataWithRelations, OrderItemWithRelations } from '@project-lc/shared-types';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import { OrderStatusBadge } from '@project-lc/components-shared/order/OrderStatusBadge';
import { useRouter } from 'next/router';

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
  const router = useRouter();
  const goodsId = orderItem.goods.id;
  const goodsName = orderItem.goods.goods_name;
  const goodsImage = orderItem.goods.image?.[0]?.image;
  return (
    <Stack direction="row" alignItems="center">
      <Box cursor="pointer" onClick={() => router.push(`goods/${goodsId}`)}>
        <Image
          objectFit="cover"
          rounded="md"
          width="48px"
          height="48px"
          src={goodsImage}
          alt=""
        />
      </Box>
      {/* 주문상품 옵션 */}
      <Stack spacing={0}>
        {displayStatus && (
          <Stack direction="row">
            <OrderStatusBadge step={option.step} />
          </Stack>
        )}
        <Text
          fontWeight="bold"
          cursor="pointer"
          onClick={() => router.push(`goods/${goodsId}`)}
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
