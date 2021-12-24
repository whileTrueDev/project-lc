import { Button, Input, Select, Stack, Text } from '@chakra-ui/react';
import { ShippingSetType } from '@prisma/client';
import { MAX_COST, ShippingCostDto, ShippingOptionDto } from '@project-lc/shared-types';
import { useShippingSetItemStore } from '@project-lc/stores';
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KOREA_PROVINCES } from '../constants/address';
import { ErrorText } from './ShippingOptionIntervalApply';

/** 지역선택 셀렉트박스 강조 스타일 */
export const areaSelectStyle = {
  bg: 'orange.100',
  color: 'black',
};

/** 배송비 고정 옵션 적용 */
export function ShippingOptionFixedApply({
  shippingSetType,
}: {
  shippingSetType: ShippingSetType;
}): JSX.Element {
  const {
    setShippingOptions,
    addShippingOption,
    delivery_limit: deliveryLimit,
    shippingOptions,
    changeShippingOption,
  } = useShippingSetItemStore();
  const {
    register,
    formState: { errors },
    control,
    setValue,
    getValues,
    trigger,
  } = useForm<ShippingCostDto>({
    defaultValues: {
      shipping_cost: 2500,
      shipping_area_name:
        deliveryLimit === 'limit' || shippingSetType === 'add' ? '지역 선택' : '대한민국',
    },
  });

  useEffect(() => {
    // deliveryLimit(전국배송, 지역배송)값 변경시 지역과 배송비 초기화
    setValue(
      'shipping_area_name',
      deliveryLimit === 'limit' || shippingSetType === 'add' ? '지역 선택' : '대한민국',
    );
    setValue('shipping_cost', 2500);
  }, [deliveryLimit, setValue, shippingSetType]);

  // 배송방법 추가
  const addFixedOption = useCallback(async () => {
    // handleSubmit 이 아닌 onClick 이벤트 핸들러를 사용(상품등록 폼 내에 해당 폼이 존재하여 submit 이벤트가 버블링됨)
    // trigger로 validation 체크 필요
    const validationPassed = await trigger();
    if (!validationPassed) return;

    const data: ShippingCostDto = getValues();
    const { shipping_area_name } = data;
    if (shipping_area_name === '지역 선택') {
      return;
    }
    const newOption: ShippingOptionDto = {
      shipping_set_type: shippingSetType,
      shipping_opt_type: 'fixed',
      section_st: null,
      section_ed: null,
      default_yn: null,
      shippingCost: data,
    };
    if (deliveryLimit === 'limit' || shippingSetType === 'add') {
      // 지역배송인 경우
      const sameAreaOptionIndex = shippingOptions.findIndex(
        (opt) =>
          opt.shippingCost.shipping_area_name === shipping_area_name &&
          opt.shipping_set_type === shippingSetType,
      );
      // 기존에 동일 지역이 추가되어 있다면 해당 옵션 변경
      if (sameAreaOptionIndex !== -1) {
        changeShippingOption(sameAreaOptionIndex, newOption);
      } else {
        // 기존옵션 중 동일 지역이 없다면 추가
        addShippingOption(newOption);
      }
    } else {
      // 전국배송인 경우 1개만 설정하도록
      setShippingOptions([newOption]);
    }
  }, [
    addShippingOption,
    changeShippingOption,
    deliveryLimit,
    getValues,
    setShippingOptions,
    shippingOptions,
    shippingSetType,
    trigger,
  ]);

  return (
    <>
      {errors.shipping_cost && <ErrorText>{errors.shipping_cost.message}</ErrorText>}
      {errors.shipping_area_name && (
        <ErrorText>{errors.shipping_area_name.message}</ErrorText>
      )}
      <Stack direction="row" as="form" alignItems="center">
        <Controller
          name="shipping_area_name"
          control={control}
          rules={{
            validate: {
              selectArea: (v) => v !== '지역 선택' || '지역을 선택해주세요',
            },
          }}
          render={({ field }) => {
            return (
              <Select w={120} {...field} {...areaSelectStyle}>
                {deliveryLimit === 'limit' || shippingSetType === 'add' ? (
                  ['지역 선택', ...KOREA_PROVINCES].map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))
                ) : (
                  <option value="대한민국">대한민국</option>
                )}
              </Select>
            );
          }}
        />

        <Input
          width="100px"
          type="number"
          max={MAX_COST}
          {...register('shipping_cost', {
            required: '배송비를 입력해주세요',
            valueAsNumber: true,
            validate: {
              positive: (v) => (v && Number(v) > 0) || '양수를 입력해주세요',
            },
          })}
        />
        <Text>₩</Text>
        <Button onClick={addFixedOption}>적용</Button>
      </Stack>
    </>
  );
}

export default ShippingOptionFixedApply;
