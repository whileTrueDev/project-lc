import { Text, Flex, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { FindFmOrderDetailRes } from '@project-lc/shared-types';
import { ChakraNextImage } from '..';

export interface OrderDetailGoodsProps {
  order: FindFmOrderDetailRes;
}

/** 주문 상품 정보 */
export function OrderDetailGoods({ order }: OrderDetailGoodsProps) {
  const orderPrice = useMemo(() => {
    const reduced = order.options.reduce((p, c) => p + Number(c.price) * Number(c.ea), 0);
    return `${reduced.toLocaleString()} 원`;
  }, [order.options]);
  return (
    <Flex>
      {order.image && (
        <ChakraNextImage
          layout="intrinsic"
          width={60}
          height={60}
          alt=""
          src={`http://whiletrue.firstmall.kr${order.image}`}
        />
      )}
      <Box ml={order.image ? 4 : 0}>
        <Text
          fontWeight="bold"
          color="blue.500"
          textDecoration="underline"
          cursor="pointer"
          onClick={() =>
            window.open(`http://whiletrue.firstmall.kr/goods/view?no=${order.goods_seq}`)
          }
        >
          {order.goods_name}
        </Text>
        <Text>총 주문금액 {orderPrice}</Text>
      </Box>
    </Flex>
  );
}

export default OrderDetailGoods;
