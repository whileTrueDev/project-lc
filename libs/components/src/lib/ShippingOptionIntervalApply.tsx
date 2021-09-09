/* eslint-disable react/jsx-props-no-spreading */
import { Button, FormControl, Input, Select, Stack, Text } from '@chakra-ui/react';
import { useDisplaySize } from '@project-lc/hooks';
import {
  ShippingCostType,
  ShippingOptionSetType,
  ShippingOptionType,
} from '@project-lc/shared-types';
import { useShippingSetItemStore } from '@project-lc/stores';
import { useEffect, useMemo } from 'react';
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

type IntervalFormType = {
  sectionStart: null | number;
  sectionEnd: null | number;
} & ShippingCostType;

export function ShippingOptionIntervalApply({
  shippingSetType,
  shippingOptType,
  suffix,
}: {
  shippingSetType: ShippingOptionSetType;
  shippingOptType: ShippingOptionType;
  suffix: string;
}): JSX.Element {
  const { deliveryLimit } = useShippingSetItemStore();
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
      sectionStart: 1,
      sectionEnd: null,
      cost: 2500,
      areaName: deliveryLimit === 'unlimit' ? '대한민국' : '지역 선택',
    },
  });

  const { addShippingOption, shippingOptions } = useShippingSetItemStore();
  const onSubmit = (data: IntervalFormType) => {
    const { sectionStart, sectionEnd, cost, areaName } = data;
    // 1. costItem 생성
    // 2. shippingOption 생성
    // 3. addShippingOption
    addShippingOption({
      shippingSetType,
      shippingOptType,
      sectionStart,
      sectionEnd,
      costItem: {
        cost,
        areaName,
      },
    });
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      setValue(
        'sectionStart',
        shippingOptions.length
          ? shippingOptions[shippingOptions.length - 1].sectionEnd
          : null,
      );
      setValue('sectionEnd', null);
    }
  }, [isSubmitSuccessful, shippingOptions, setValue]);

  useEffect(() => {
    reset({
      sectionStart: 1,
      sectionEnd: null,
      cost: 2500,
      areaName: deliveryLimit === 'unlimit' ? '대한민국' : '지역 선택',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shippingOptType]);

  const suffixText = useMemo(() => <Text>{suffix}</Text>, [suffix]);

  return (
    <>
      {errors.sectionStart && <ErrorText>{errors.sectionStart.message}</ErrorText>}
      {errors.sectionEnd && <ErrorText>{errors.sectionEnd.message}</ErrorText>}
      {errors.cost && <ErrorText>{errors.cost.message}</ErrorText>}
      {errors.areaName && <ErrorText>{errors.areaName.message}</ErrorText>}
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
            <FormControlInputWrapper id="sectionStart" suffix={`${suffix} 이상`}>
              <Input
                type="number"
                {...register('sectionStart', {
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
            <FormControlInputWrapper id="sectionEnd" suffix={`${suffix} 미만`}>
              <Input
                type="number"
                {...register('sectionEnd', {
                  valueAsNumber: true,
                  validate: {
                    biggerThanSectionStart: (v) => {
                      const sectionStart = getValues('sectionStart');
                      return (
                        (sectionStart && !v) ||
                        (sectionStart && v && v > sectionStart) ||
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
            {/* 가격 설정 */}
            <FormControl id="cost">
              <Stack direction="row" alignItems="center">
                <Input type="number" {...register('cost', { required: true })} />
                {suffixText}
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
