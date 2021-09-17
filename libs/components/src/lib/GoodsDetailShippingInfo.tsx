import { Box, Stack, Text } from '@chakra-ui/react';
import { GoodsByIdRes } from '@project-lc/shared-types';

export interface GoodsDetailShippingInfoProps {
  goods: GoodsByIdRes;
}
export function GoodsDetailShippingInfo({ goods }: GoodsDetailShippingInfoProps) {
  return (
    <Stack>
      {goods.ShippingGroup && (
        <Box>
          <Text fontWeight="bold">배송정책</Text>

          <Text>{goods.ShippingGroup?.postalCode}</Text>
          <Text>{goods.ShippingGroup?.baseAddress}</Text>
          <Text>{goods.ShippingGroup?.detailAddress}</Text>
          <Text>{goods.ShippingGroup?.shipping_group_name}</Text>
        </Box>
      )}
    </Stack>
  );
}
