import { Box, Stack, Text } from '@chakra-ui/react';
import { OrderItemOption } from '@prisma/client';
import { TextDotConnector } from '@project-lc/components-core/TextDotConnector';
import { OriginGoods } from '@project-lc/shared-types';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import { OrderStatusBadge } from './CustomerOrderItem';

export interface OrderItemOptionInfoProps {
  option: OrderItemOption;
  goodsData: OriginGoods;
  displayStatus?: boolean;
}
export function OrderItemOptionInfo({
  option,
  goodsData,
  displayStatus = true,
}: OrderItemOptionInfoProps): JSX.Element {
  const { id, goods_name, image } = goodsData;
  const goodsName = goods_name;
  const goodsImage = image[0].image;
  return (
    <Stack direction="row" alignItems="center">
      <Box
        cursor="pointer"
        onClick={() => {
          alert(`상품고유번호 ${id}의 상세페이지로 이동`);
        }}
      >
        {/* 이미지 */}
        <img width="40px" height="40px" src={goodsImage} alt="" />
      </Box>
      {/* 주문상품 옵션 */}
      <Stack>
        {displayStatus && <OrderStatusBadge step={option.step} />}

        <Text
          fontWeight="bold"
          cursor="pointer"
          onClick={() => {
            alert(`상품고유번호 ${id}의 상세페이지로 이동`);
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
