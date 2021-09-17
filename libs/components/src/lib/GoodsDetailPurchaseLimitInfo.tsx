import { Box, Stack, Text } from '@chakra-ui/react';
import { GoodsByIdRes } from '@project-lc/shared-types';

export interface GoodsDetailPurchaseLimitInfoProps {
  goods: GoodsByIdRes;
}
export function GoodsDetailPurchaseLimitInfo({
  goods,
}: GoodsDetailPurchaseLimitInfoProps) {
  return (
    <Stack>
      <Box>
        <Text fontWeight="bold">최소구매수량</Text>
        <Text>
          {goods.min_purchase_limit === 'limit' ? goods.min_purchase_ea : '제한없음'}
        </Text>
      </Box>

      <Box>
        <Text fontWeight="bold">최대구매수량</Text>
        <Text>
          {goods.max_purchase_limit === 'limit' ? goods.max_purchase_ea : '제한없음'}
        </Text>
      </Box>
    </Stack>
  );
}
