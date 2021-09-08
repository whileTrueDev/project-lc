import { Button, Input, Stack, Text } from '@chakra-ui/react';
import { ShippingOptionSetType, ShippingSetFormData } from '@project-lc/shared-types';
import { useShippingSetItemStore } from '@project-lc/stores';
import { useCallback, useState } from 'react';
import ShippingOptionIntervalApply from './ShippingOptionIntervalApply';
import ShippingOptionFixedApply from './ShippingOptionFixedApply';
import ShippingOptionFreeApply from './ShippingOptionFreeApply';
import ShippingOptionTypeSelect, {
  ShippingSelectOption,
  ShippingSelectOptions,
} from './ShippingOptionTypeSelect';
import ShippingOptionRepeatApply from './ShippingOptionRepeatApply';

/** 대한민국 전국배송
 *
 * 여기서 생성되는 배송옵션의
 * 배송비 타입의 areaName은 '대한민국' 고정,
 * areaDetail: undefined
 */
export function ShippingUnlimitOptionApplySection({
  shippingSetType = 'std',
}: {
  shippingSetType?: ShippingOptionSetType;
}): JSX.Element {
  const [selectOption, setSelectOption] = useState<ShippingSelectOption>(
    ShippingSelectOptions[0],
  );
  const changeOption = useCallback((type: ShippingSelectOption) => {
    setSelectOption(type);
  }, []);

  const { shippingOptions, removeShippingOption } = useShippingSetItemStore();

  return (
    <Stack>
      <Stack>
        {shippingOptions.length === 0 && (
          <Text>
            적용된 배송비 옵션이 없습니다. &quot;적용&quot; 버튼을 눌러 옵션을 1개 이상
            적용해주세요.
          </Text>
        )}

        {shippingOptions.map((opt) => (
          // TODO: 삭제버튼 있는 목록 컴포넌트 생성
          <Text key={opt.tempId} onClick={() => removeShippingOption(opt.tempId)}>
            {JSON.stringify(opt)}
          </Text>
        ))}
      </Stack>

      <ShippingOptionTypeSelect option={selectOption} changeOption={changeOption} />

      {/* optionType에 따른 인풋들 */}
      {/* 무료 */}
      {selectOption.key === 'free' && (
        <ShippingOptionFreeApply shippingSetType={shippingSetType} />
      )}

      {/* 고정 */}
      {selectOption.key === 'fixed' && (
        <ShippingOptionFixedApply shippingSetType={shippingSetType} />
      )}

      {/* 금액, 수량, 무게 - 구간입력 */}
      {['amount', 'cnt', 'weight'].includes(selectOption.key) && (
        <ShippingOptionIntervalApply
          shippingSetType={shippingSetType}
          shippingOptType={selectOption.key}
          suffix={selectOption.suffix}
        />
      )}

      {/* 금액, 수량, 무게 -  구간반복 */}
      {selectOption.key.includes('rep') && (
        <ShippingOptionRepeatApply
          shippingSetType={shippingSetType}
          shippingOptType={selectOption.key}
          suffix={selectOption.suffix}
        />
      )}
    </Stack>
  );
}

export default ShippingUnlimitOptionApplySection;
