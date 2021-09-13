/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import { Button, FormControl, Input, Select, Stack, Text } from '@chakra-ui/react';
import { ShippingOptType, ShippingSetType } from '@prisma/client';
import { ShippingCostDto, ShippingOptionDto } from '@project-lc/shared-types';
import { useShippingSetItemStore } from '@project-lc/stores';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KOREA_PROVINCES } from '../constants/address';
import FormControlInputWrapper from './FormControlInputWrapper';
import { ResponsiveDivider } from './ResponsiveDivider';

export function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <Text fontSize="xs" color="red">
      {children}
    </Text>
  );
}

type IntervalFormType = Pick<ShippingOptionDto, 'section_st' | 'section_ed'> &
  ShippingCostDto;
export function ShippingOptionIntervalApply({
  shippingSetType,
  shippingOptType,
  suffix,
}: {
  shippingSetType: ShippingSetType;
  shippingOptType: ShippingOptType;
  suffix: string;
}): JSX.Element {
  const { delivery_limit: deliveryLimit } = useShippingSetItemStore();
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    control,
    setValue,
    formState: { isSubmitSuccessful, errors },
  } = useForm<IntervalFormType>({
    defaultValues: {
      section_st: 1,
      section_ed: null,
      shipping_cost: 2500,
      shipping_area_name:
        deliveryLimit === 'limit' || shippingSetType === 'add' ? '지역 선택' : '대한민국',
    },
  });

  const { addShippingOption, shippingOptions } = useShippingSetItemStore();
  const onSubmit = (data: IntervalFormType) => {
    const { section_st, section_ed, shipping_cost, shipping_area_name } = data;
    addShippingOption({
      default_yn: null,
      shipping_set_type: shippingSetType,
      shipping_opt_type: shippingOptType,
      section_st,
      section_ed,
      shippingCost: {
        shipping_cost,
        shipping_area_name,
      },
    });
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      // 시작값을 이전 옵션의 종료값으로 설정
      setValue(
        'section_st',
        shippingOptions.length
          ? shippingOptions[shippingOptions.length - 1].section_ed
          : null,
      );
      setValue('section_ed', null);
    }
  }, [isSubmitSuccessful, shippingOptions, setValue]);

  useEffect(() => {
    reset();
  }, [reset, shippingOptType]);

  return (
    <>
      {errors.section_st && <ErrorText>{errors.section_st.message}</ErrorText>}
      {errors.section_ed && <ErrorText>{errors.section_ed.message}</ErrorText>}
      {errors.shipping_cost && <ErrorText>{errors.shipping_cost.message}</ErrorText>}
      {errors.shipping_area_name && (
        <ErrorText>{errors.shipping_area_name.message}</ErrorText>
      )}
      <Stack
        direction="row"
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        alignItems="center"
        border="1px"
        borderColor="gray.200"
        borderRadius="md"
        p={2}
      >
        <Stack direction={{ base: 'column', sm: 'row' }}>
          {/* 범위 지정 */}
          <Stack direction="row" alignItems="center">
            {/* 첫번째 범위 인풋 */}
            <FormControlInputWrapper id="section_st" suffix={`${suffix} 이상`}>
              <Input
                type="number"
                {...register('section_st', {
                  required: '시작값을 입력해주세요',
                  valueAsNumber: true,
                  validate: {
                    positive: (v) => (v && v > 0) || '양수를 입력해주세요',
                  },
                })}
              />
            </FormControlInputWrapper>
            <Text>~</Text>
            {/* 두번째 범위 인풋 */}
            <FormControlInputWrapper id="section_ed" suffix={`${suffix} 미만`}>
              <Input
                type="number"
                {...register('section_ed', {
                  valueAsNumber: true,
                  validate: {
                    biggerThansection_st: (v) => {
                      const section_st = getValues('section_st');
                      return (
                        (section_st && !v) ||
                        (section_st && v && v > section_st) ||
                        '시작값보다 큰 값을 입력해주세요'
                      );
                    },
                  },
                })}
              />
            </FormControlInputWrapper>
          </Stack>
          <ResponsiveDivider />

          {/* 지역, 가격 설정 */}
          <Stack>
            {/* 지역 설정 셀렉트 */}
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
            {/* 가격 설정 */}
            <FormControl id="shipping_cost">
              <Stack direction="row" alignItems="center">
                <Input
                  type="number"
                  {...register('shipping_cost', {
                    required: '배송비를 입력해주세요',
                    validate: {
                      positive: (v) => (v && v > 0) || '양수를 입력해주세요',
                    },
                  })}
                />
                <Text>{suffix}</Text>
              </Stack>
            </FormControl>
          </Stack>
        </Stack>

        <Button type="submit">적용</Button>
      </Stack>
    </>
  );
}

export default ShippingOptionIntervalApply;
