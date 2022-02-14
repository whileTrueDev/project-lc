import { Badge, Box, Flex, Stack, Text } from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import SellTypeBadge from '@project-lc/components-shared/SellTypeBadge';
import { FindFmOrderDetailRes } from '@project-lc/shared-types';
import { SellType } from '@prisma/client';
import { useMemo } from 'react';

export interface OrderDetailGoodsProps {
  orderItem: FindFmOrderDetailRes['items'][0];
  option?: { title: string; value: string };
  sellType: SellType;
}

/** 주문 상품 정보 */
export function OrderDetailGoods({
  orderItem,
  option,
  sellType,
}: OrderDetailGoodsProps): JSX.Element {
  const orderPrice = useMemo(() => {
    const reduced = orderItem.options.reduce(
      (p, c) => p + Number(c.price) * Number(c.ea),
      0,
    );
    return `${reduced.toLocaleString()} 원`;
  }, [orderItem.options]);

  return (
    <Flex>
      {orderItem.image && (
        <ChakraNextImage
          layout="intrinsic"
          width={60}
          height={60}
          alt=""
          src={`http://whiletrue.firstmall.kr${orderItem.image || ''}`}
        />
      )}
      <Box ml={orderItem.image ? 4 : 0}>
        <Text
          fontWeight="bold"
          color="blue.500"
          textDecoration="underline"
          cursor="pointer"
          onClick={() =>
            window.open(
              `http://whiletrue.firstmall.kr/goods/view?no=${orderItem.goods_seq}`,
            )
          }
        >
          {orderItem.goods_name}
        </Text>

        {!option ? (
          <Text>총 주문금액 {orderPrice}</Text>
        ) : (
          <Text>
            <Badge>옵션</Badge>
            <Text fontSize="sm" as="span" ml={2}>
              {option.title} {option.value}
            </Text>
          </Text>
        )}

        {sellType && (
          <Stack direction="row" align="center">
            <Text>판매유형</Text>
            <SellTypeBadge sellType={sellType} lineHeight="unset" />
          </Stack>
        )}
      </Box>
    </Flex>
  );
}

export default OrderDetailGoods;
