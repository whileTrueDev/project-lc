import { Image, Stack, Text, LinkBox, LinkOverlay } from '@chakra-ui/react';
import { OrderItemOption } from '@prisma/client';
import { TextDotConnector } from '@project-lc/components-core/TextDotConnector';
import { OrderDataWithRelations, OrderItemWithRelations } from '@project-lc/shared-types';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import { OrderStatusBadge } from '@project-lc/components-shared/order/OrderStatusBadge';
import Link from 'next/link';

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
    <LinkBox display="flex" alignItems="center" justifyContent="center">
      <Stack direction="row" alignItems="center">
        <Image
          objectFit="cover"
          rounded="md"
          width="48px"
          height="48px"
          src={goodsImage}
          alt=""
        />
        {/* 주문상품 옵션 */}
        <Stack spacing={0}>
          {displayStatus && (
            <Stack direction="row">
              <OrderStatusBadge step={option.step} />
            </Stack>
          )}
          <Link passHref href={`/goods/${goodsId}`}>
            <LinkOverlay isExternal>
              <Text fontWeight="bold">{goodsName}</Text>
            </LinkOverlay>
          </Link>

          <Stack direction="row">
            {option.name && option.value && (
              <>
                <Text>
                  {option.name} : {option.value}
                </Text>
                <TextDotConnector />
              </>
            )}
            <Text>{option.quantity} 개 </Text>
            <TextDotConnector />
            <Text>
              {getLocaleNumber(Number(option.discountPrice) * option.quantity)}원
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </LinkBox>
  );
}
