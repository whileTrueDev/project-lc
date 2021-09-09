/* eslint-disable react/jsx-props-no-spreading */
import { Stack, Input, Button, Text, Select } from '@chakra-ui/react';
import {
  ShippingCostType,
  ShippingOption,
  ShippingOptionSetType,
} from '@project-lc/shared-types';
import { useShippingSetItemStore } from '@project-lc/stores';
import { useCallback, useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ErrorText } from './ShippingOptionIntervalApply';
import { KOREA_PROVINCES } from '../constants/address';

// 배송비 고정 옵션 적용
export function ShippingOptionFixedApply({
  shippingSetType,
}: {
  shippingSetType: ShippingOptionSetType;
}): JSX.Element {
  const { setShippingOptions, addShippingOption, deliveryLimit } =
    useShippingSetItemStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<ShippingCostType>({
    defaultValues: {
      cost: 2500,
      areaName: deliveryLimit === 'unlimit' ? '대한민국' : '지역 선택',
    },
  });

  useEffect(() => {
    reset();
  }, [deliveryLimit, reset]);

  // 배송방법 추가
  const addFixedOption = useCallback(
    (data: ShippingCostType) => {
      const { areaName, cost } = data;
      if (areaName === '지역 선택') {
        return;
      }
      const newOption: Omit<ShippingOption, 'tempId'> = {
        shippingSetType,
        shippingOptType: 'fixed',
        sectionStart: null,
        sectionEnd: null,
        costItem: data,
      };
      if (deliveryLimit === 'unlimit') {
        // 전국배송인 경우 1개만 설정하도록
        setShippingOptions([newOption]);
      } else {
        // 지역배송인 경우 추가하도록
        addShippingOption(newOption);
      }
    },
    [addShippingOption, deliveryLimit, setShippingOptions, shippingSetType],
  );

  return (
    <>
      {errors.cost && <ErrorText>{errors.cost.message}</ErrorText>}
      {errors.areaName && <ErrorText>{errors.areaName.message}</ErrorText>}
      <Stack
        direction="row"
        as="form"
        alignItems="center"
        onSubmit={handleSubmit(addFixedOption)}
      >
        <Controller
          name="areaName"
          control={control}
          rules={{
            validate: {
              selectArea: (v) => v !== '지역 선택' || '지역을 선택해주세요',
            },
          }}
          render={({ field }) => {
            return (
              <Select w={120} {...field}>
                {deliveryLimit === 'unlimit' ? (
                  <option value="대한민국">대한민국</option>
                ) : (
                  ['지역 선택', ...KOREA_PROVINCES].map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))
                )}
              </Select>
            );
          }}
        />

        <Input
          width="100px"
          type="number"
          {...register('cost', {
            required: '배송비를 입력해주세요',
            valueAsNumber: true,
            validate: {
              positive: (v) => (v && v > 0) || '양수를 입력해주세요',
            },
          })}
        />
        <Text>₩</Text>
        <Button type="submit">적용</Button>
      </Stack>
    </>
  );
}

export default ShippingOptionFixedApply;
