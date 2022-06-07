import { Stack, Box, Text } from '@chakra-ui/react';
import TextDotConnector from '@project-lc/components-core/TextDotConnector';
import { ExchangeReturnCancelItemBaseData } from '@project-lc/shared-types';
import { getLocaleNumber } from '@project-lc/utils-frontend';

interface ExchangeReturnCancelRequestGoodsDataProps
  extends ExchangeReturnCancelItemBaseData {
  amount: number;
}
/** 교환,환불,주문취소 상품 & 옵션 & 개수 표시 컴포넌트 */
export function ExchangeReturnCancelRequestGoodsData(
  props: ExchangeReturnCancelRequestGoodsDataProps,
): JSX.Element {
  const { goodsName, image, optionName, optionValue, amount, price } = props;
  return (
    <Stack direction="row" alignItems="center">
      <Box>
        {/* 이미지 */}
        <img width="40px" height="40px" src={image} alt="" />
      </Box>
      {/* 주문상품 옵션 */}
      <Stack>
        <Text fontWeight="bold">{goodsName}</Text>
        <Stack direction="row">
          <Text>
            {optionName} : {optionValue}
          </Text>
          <TextDotConnector />
          <Text>{amount} 개 </Text>
          <TextDotConnector />
          <Text>{getLocaleNumber(price)}원</Text>
        </Stack>
      </Stack>
    </Stack>
  );
}
