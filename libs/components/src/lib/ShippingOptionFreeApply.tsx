import { Button, Stack } from '@chakra-ui/react';
import { ShippingOptionSetType } from '@project-lc/shared-types';
import { useShippingSetItemStore } from '@project-lc/stores';
import { useCallback } from 'react';

// 무료 옵션 적용
export function ShippingOptionFreeApply({
  shippingSetType,
}: {
  shippingSetType: ShippingOptionSetType;
}) {
  const { addShippingOption, shippingOptions } = useShippingSetItemStore();

  const isFreeOptionAdded = !!shippingOptions.find(
    (opt) => opt.shippingOptType === 'free',
  );

  // 배송방법 추가
  const addFreeOption = useCallback(() => {
    addShippingOption({
      shippingSetType,
      shippingOptType: 'free',
      sectionStart: null,
      sectionEnd: null,
      costItem: {
        tempId: 0,
        areaName: '대한민국',
        cost: 0,
      },
    });
  }, [addShippingOption, shippingSetType]);

  return (
    <Stack direction="row">
      <Button onClick={addFreeOption} disabled={isFreeOptionAdded}>
        적용
      </Button>
    </Stack>
  );
}

export default ShippingOptionFreeApply;
