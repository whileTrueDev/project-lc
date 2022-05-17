import { Box } from '@chakra-ui/react';
import { ShippingCost, ShippingOption, ShippingSet } from '@prisma/client';
import { TempShippingOption, TempShippingSet } from '@project-lc/shared-types';
import ShippingPolicySetListItem from './ShippingPolicySetListItem';

interface ShippingGroupSetsProps {
  shippingSets: (ShippingSet & {
    shippingOptions: (ShippingOption & {
      shippingCost: ShippingCost[];
    })[];
  })[];
}
export function ShippingGroupSets({ shippingSets }: ShippingGroupSetsProps): JSX.Element {
  // 타입 맞추기 위한 데이터 형태 변경
  const sets: TempShippingSet[] = shippingSets.map((set) => {
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
    <Box>
      {sets.map((set) => (
        <ShippingPolicySetListItem key={set.tempId} set={set} />
      ))}
    </Box>
  );
}

export default ShippingGroupSets;
