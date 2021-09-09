import { InfoIcon } from '@chakra-ui/icons';
import { Stack, Text } from '@chakra-ui/react';
import { ShippingOptionSetType } from '@project-lc/shared-types';
import { useShippingSetItemStore } from '@project-lc/stores';
import { useCallback, useState } from 'react';
import ShippingOptionAppliedItem from './ShippingOptionAppliedItem';
import ShippingOptionFixedApply from './ShippingOptionFixedApply';
import ShippingOptionFreeApply from './ShippingOptionFreeApply';
import ShippingOptionIntervalApply from './ShippingOptionIntervalApply';
import ShippingOptionRepeatApply from './ShippingOptionRepeatApply';
import ShippingOptionTypeSelect, {
  ShippingSelectOption,
  ShippingSelectOptions,
} from './ShippingOptionTypeSelect';

/**
 *
 * deliveryLimit === 'unlimit' : 대한민국 전국배송
 *  => 배송비 타입의 areaName은 '대한민국' 고정, areaDetail: undefined
 *
 * deliveryLimit === 'limit' : 지정 지역 배송
 *  => costItem은 여러개, areaName은 지역그룹명, detailArea?[]
 */
export function ShippingOptionApplySection({
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
  const appliedStdOptList = shippingOptions.filter(
    (opt) => opt.shippingSetType === 'std',
  );

  return (
    <Stack>
      <ShippingOptionTypeSelect option={selectOption} changeOption={changeOption} />
      {/* 적용된 배송비 옵션 없을때 표시문구 */}
      {appliedStdOptList.length === 0 && (
        <Text color="blue.500" fontSize="sm">
          <InfoIcon mr={2} />
          적용된 배송비 옵션이 없습니다. &quot;적용&quot; 버튼을 눌러 옵션을 1개 이상
          적용해주세요.
        </Text>
      )}
      {/* 적용된 배송비 옵션 목록 */}
      {appliedStdOptList.map((opt) => (
        <ShippingOptionAppliedItem
          key={opt.tempId}
          selectOption={selectOption}
          item={opt}
          onDelete={removeShippingOption}
        />
      ))}

      {/* optionType에 따른 입력폼들 */}
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

export default ShippingOptionApplySection;
