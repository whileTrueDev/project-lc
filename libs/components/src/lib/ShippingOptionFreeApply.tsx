import { Button, Stack, Text } from '@chakra-ui/react';
import { ShippingSetType } from '@prisma/client';
import { useShippingSetItemStore } from '@project-lc/stores';
import { useCallback } from 'react';

// 무료 옵션 적용
export function ShippingOptionFreeApply({
  shippingSetType,
}: {
  shippingSetType: ShippingSetType;
}) {
  const { addShippingOption, shippingOptions } = useShippingSetItemStore();

  const isFreeOptionAdded = !!shippingOptions.find(
    (opt) => opt.shipping_opt_type === 'free',
  );

  // 배송방법 추가
  const addFreeOption = useCallback(() => {
    addShippingOption({
      shipping_set_type: shippingSetType,
      shipping_opt_type: 'free',
      section_st: null,
      section_ed: null,
      default_yn: null,
      shippingCost: {
        shipping_area_name: '대한민국',
        shipping_cost: 0,
      },
    });
  }, [addShippingOption, shippingSetType]);

  return (
    <Stack direction="row" alignItems="center">
      <Text>대한민국 · 무료</Text>
      <Button onClick={addFreeOption} disabled={isFreeOptionAdded}>
        적용
      </Button>
    </Stack>
  );
}

export default ShippingOptionFreeApply;
