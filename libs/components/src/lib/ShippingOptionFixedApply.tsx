/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import { Button, Input, Select, Stack, Text } from '@chakra-ui/react';
import { ShippingSetType } from '@prisma/client';
import { ShippingCostDto, ShippingOptionDto } from '@project-lc/shared-types';
import { useShippingSetItemStore } from '@project-lc/stores';
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KOREA_PROVINCES } from '../constants/address';
import { ErrorText } from './ShippingOptionIntervalApply';

// 배송비 고정 옵션 적용
export function ShippingOptionFixedApply({
  shippingSetType,
}: {
  shippingSetType: ShippingSetType;
}): JSX.Element {
  const {
    setShippingOptions,
    addShippingOption,
    delivery_limit: deliveryLimit,
  } = useShippingSetItemStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<ShippingCostDto>({
    defaultValues: {
      shipping_cost: 2500,
      shipping_area_name:
        deliveryLimit === 'limit' || shippingSetType === 'add' ? '지역 선택' : '대한민국',
    },
  });

  useEffect(() => {
    reset();
  }, [deliveryLimit, reset]);

  // 배송방법 추가
  const addFixedOption = useCallback(
    (data: ShippingCostDto) => {
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
        // 지역배송인 경우 추가하도록
        addShippingOption(newOption);
      } else {
        // 전국배송인 경우 1개만 설정하도록
        setShippingOptions([newOption]);
      }
    },
    [addShippingOption, deliveryLimit, setShippingOptions, shippingSetType],
  );

  return (
    <>
      {errors.shipping_cost && <ErrorText>{errors.shipping_cost.message}</ErrorText>}
      {errors.shipping_area_name && (
        <ErrorText>{errors.shipping_area_name.message}</ErrorText>
      )}
      <Stack
        direction="row"
        as="form"
        alignItems="center"
        onSubmit={handleSubmit(addFixedOption)}
      >
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
              <Select w={120} {...field}>
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
          {...register('shipping_cost', {
            required: '배송비를 입력해주세요',
            valueAsNumber: true,
            validate: {
              positive: (v) => (v && Number(v) > 0) || '양수를 입력해주세요',
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
