import { Select, Stack, Text } from '@chakra-ui/react';
import { ShippingOptType, ShippingSetType } from '@prisma/client';
import { useShippingGroupItemStore, useShippingSetItemStore } from '@project-lc/stores';
import { useCallback } from 'react';

// free - 무료 / fixed - 고정 / amount - 금액 / cnt - 수량 / weight - 무게
// 금액, 수량, 무게는 구간입력, 구간반복 존재
// 금액 suffix : ₩
// 수량 suffix : 개
// 무게 suffix : kg
// 구간입력 시 하단 인풋 추가가능(옵션 증가)
// 구간반복시 고정인풋 두개(옵션 2개 고정)
export type ShippingSelectOption = {
  key: ShippingOptType;
  label: string;
  suffix: string;
};

export const ShippingSelectOptions: ShippingSelectOption[] = [
  { key: 'free', label: '무료', suffix: '' },
  { key: 'fixed', label: '고정', suffix: '' },
  { key: 'amount', label: '금액(구간입력)', suffix: '₩' },
  { key: 'amount_rep', label: '금액(구간반복)', suffix: '₩' },
  { key: 'cnt', label: '수량(구간입력)', suffix: '개' },
  { key: 'cnt_rep', label: '수량(구간반복)', suffix: '개' },
  { key: 'weight', label: '무게(구간입력)', suffix: 'kg' },
  { key: 'weight_rep', label: '무게(구간반복)', suffix: 'kg' },
];

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
      const nextOption = ShippingSelectOptions.find(
        (opt) => opt.key === e.currentTarget.value,
      );
      if (nextOption) {
        changeOption(nextOption);
        clearShippingOptions(shippingSetType);
      }
    },
    [changeOption, clearShippingOptions, shippingSetType],
  );

  let availableOptions = ShippingSelectOptions;
  // 배송비 계산기준 - '무료계산-묶음배송'인 경우 '무료'만 설정 가능
  if (shippingCalculType === 'free') availableOptions = ShippingSelectOptions.slice(0, 1);
  // 추가옵션인 경우 '무료' 옵션 없음
  if (shippingSetType === 'add') availableOptions = ShippingSelectOptions.slice(1);

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
