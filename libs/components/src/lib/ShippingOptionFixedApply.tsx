import { Stack, Input, Button, Text } from '@chakra-ui/react';
import { ShippingOptionSetType, ShippingSetFormData } from '@project-lc/shared-types';
import { useShippingSetItemStore } from '@project-lc/stores';
import { useCallback, useRef } from 'react';

// 배송비 고정 옵션 적용
export function ShippingOptionFixedApply({
  shippingSetType,
}: {
  shippingSetType: ShippingOptionSetType;
}): JSX.Element {
  const inputRef = useRef<null | HTMLInputElement>(null);

  const { setShippingOptions } = useShippingSetItemStore();

  // 배송방법 추가
  const addFixedOption = useCallback(() => {
    if (!inputRef.current) return;
    setShippingOptions([
      {
        shippingSetType,
        shippingOptType: 'fixed',
        sectionStart: null,
        sectionEnd: null,
        costItem: {
          tempId: 0,
          areaName: '대한민국',
          cost: Number(inputRef.current.value),
        },
      },
    ]);
  }, [setShippingOptions, shippingSetType]);

  return (
    <Stack direction="row" alignItems="center">
      <Text>대한민국</Text>
      <Input width="100px" type="number" ref={inputRef} defaultValue={2500} />
      <Text>₩</Text>
      <Button onClick={addFixedOption}>적용</Button>
    </Stack>
  );
}

export default ShippingOptionFixedApply;
