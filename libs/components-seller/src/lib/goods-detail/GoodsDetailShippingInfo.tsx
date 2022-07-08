import { Box, Stack, Text } from '@chakra-ui/react';
import ShippingGroupSets from '@project-lc/components-shared/shipping/ShippingGroupSets';
import { GoodsByIdRes, ShippingCalculTypeOptions } from '@project-lc/shared-types';

export interface GoodsDetailShippingInfoProps {
  goods: GoodsByIdRes;
}
export function GoodsDetailShippingInfo({
  goods,
}: GoodsDetailShippingInfoProps): JSX.Element | null {
  if (!goods.ShippingGroup) return null;

  return (
    <Stack>
      <Stack spacing={4}>
        <Box>
          <Text fontWeight="bold">배송정책 이름</Text>
          <Text>{goods.ShippingGroup.shipping_group_name}</Text>
        </Box>

        <Box>
          <Text fontWeight="bold">배송비 계산 기준</Text>
          <Text>
            {ShippingCalculTypeOptions[goods.ShippingGroup.shipping_calcul_type].label}
          </Text>
        </Box>

        <Box>
          <Text fontWeight="bold">반송지</Text>
          <Text>
            {`(${goods.ShippingGroup.postalCode}) ${goods.ShippingGroup.baseAddress} ${goods.ShippingGroup.detailAddress}`}
          </Text>
        </Box>

        <Box>
          <Text fontWeight="bold">배송 방법 상세</Text>
          <Box mt={2}>
            <ShippingGroupSets shippingSets={goods.ShippingGroup.shippingSets} />
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
}
