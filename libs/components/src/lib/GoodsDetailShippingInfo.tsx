/* eslint-disable camelcase */
import { Box, Stack, Text } from '@chakra-ui/react';
import {
  GoodsByIdRes,
  ShippingCalculTypeOptions,
  TempShippingOption,
  TempShippingSet,
} from '@project-lc/shared-types';
import ShippingPolicySetListItem from './ShippingPolicySetListItem';

export interface GoodsDetailShippingInfoProps {
  goods: GoodsByIdRes;
}
export function GoodsDetailShippingInfo({ goods }: GoodsDetailShippingInfoProps) {
  if (!goods.ShippingGroup) return null;

  // 타입 맞추기 위한 데이터 형태 변경
  const sets: TempShippingSet[] = goods.ShippingGroup.shippingSets.map((set) => {
    const {
      id,
      shippingOptions,
      refund_shiping_cost,
      swap_shiping_cost,
      ...restSetData
    } = set;
    const tempOptions: TempShippingOption[] = shippingOptions.map((opt) => {
      const { id: optId, shippingCost, ...restOptData } = opt;
      const { shipping_cost, shipping_area_name } = shippingCost[0];
      return {
        tempId: optId,
        shippingCost: { shipping_cost: Number(shipping_cost), shipping_area_name },
        ...restOptData,
      };
    });
    return {
      tempId: id,
      shippingOptions: tempOptions,
      refund_shiping_cost: Number(refund_shiping_cost),
      swap_shiping_cost: Number(swap_shiping_cost),
      ...restSetData,
    };
  });

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
            {sets.map((set) => (
              <ShippingPolicySetListItem key={set.tempId} set={set} />
            ))}
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
}
