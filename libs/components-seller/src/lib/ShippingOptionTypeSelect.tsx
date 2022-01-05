import { Select, Stack, Text } from '@chakra-ui/react';
import { ShippingSetType } from '@prisma/client';
import { ShippingSelectOption, shippingSelectOptions } from '@project-lc/shared-types';
import { useShippingGroupItemStore, useShippingSetItemStore } from '@project-lc/stores';
import { useCallback } from 'react';

export function ShippingOptionTypeSelect({
  option,
  changeOption,
  shippingSetType = 'std',
}: {
  option: ShippingSelectOption;
  changeOption: (opt: ShippingSelectOption) => void;
  onChange?: () => void;
  shippingSetType?: ShippingSetType;
}): JSX.Element {
  const { clearShippingOptions } = useShippingSetItemStore();
  const { shipping_calcul_type: shippingCalculType } = useShippingGroupItemStore();
  const changeHandler = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const nextOption = shippingSelectOptions.find(
        (opt) => opt.key === e.currentTarget.value,
      );
      if (nextOption) {
        changeOption(nextOption);
        clearShippingOptions(shippingSetType);
      }
    },
    [changeOption, clearShippingOptions, shippingSetType],
  );

  let availableOptions = shippingSelectOptions;
  // 배송비 계산기준 - '무료계산-묶음배송'인 경우 '무료'만 설정 가능
  if (shippingCalculType === 'free') availableOptions = shippingSelectOptions.slice(0, 1);
  // 추가옵션인 경우 '무료' 옵션 없음
  if (shippingSetType === 'add') availableOptions = shippingSelectOptions.slice(1);

  return (
    <Stack direction="row" alignItems="center">
      <Text>배송비</Text>
      <Select onChange={changeHandler} value={option.key} w="150px">
        {availableOptions.map((opt) => {
          const { key, label } = opt;
          return (
            <option key={key} value={key}>
              {label}
            </option>
          );
        })}
      </Select>
    </Stack>
  );
}

export default ShippingOptionTypeSelect;
