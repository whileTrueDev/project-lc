/* eslint-disable react/jsx-props-no-spreading */
import {
  Center,
  Divider,
  Stack,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useDisplaySize } from '@project-lc/hooks';
import { ShippingOptionSetType, ShippingOptionType } from '@project-lc/shared-types';
import { useShippingSetItemStore } from '@project-lc/stores';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

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
  cost: number;
};

export function ShippingOptionIntervalApply({
  shippingSetType,
  shippingOptType,
  suffix,
}: {
  shippingSetType: ShippingOptionSetType;
  shippingOptType: ShippingOptionType;
  suffix: string;
}): JSX.Element {
  const { isMobileSize } = useDisplaySize();
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { isSubmitSuccessful, errors },
  } = useForm<IntervalFormType>({
    defaultValues: {
      sectionStart: 1,
      sectionEnd: null,
      cost: 2500,
    },
  });

  const { addShippingOption, shippingOptions } = useShippingSetItemStore();
  const onSubmit = (data: IntervalFormType) => {
    const { sectionStart, sectionEnd, cost } = data;
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
        areaName: '대한민국',
        tempId: 0,
      },
    });
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        sectionStart: shippingOptions.length
          ? shippingOptions[shippingOptions.length - 1].sectionEnd
          : null,
        sectionEnd: null,
        cost: 2500,
      });
    }
  }, [reset, isSubmitSuccessful, shippingOptions]);

  useEffect(() => {
    reset({
      sectionStart: 1,
      sectionEnd: null,
      cost: 2500,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shippingOptType]);

  const suffixText = useMemo(() => <Text>{suffix}</Text>, [suffix]);

  return (
    <>
      {errors.sectionStart && <ErrorText>{errors.sectionStart.message}</ErrorText>}
      {errors.sectionEnd && <ErrorText>{errors.sectionEnd.message}</ErrorText>}
      {errors.cost && <ErrorText>{errors.cost.message}</ErrorText>}
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
        <Button type="submit">적용</Button>
        <Stack direction={{ base: 'column', sm: 'row' }}>
          <Stack direction="row" alignItems="center">
            <FormControl id="sectionStart">
              <FormLabel>이상</FormLabel>
              <Stack direction="row" alignItems="center">
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
                {suffixText}
              </Stack>
            </FormControl>
            <Text>~</Text>
            <FormControl id="sectionEnd">
              <FormLabel>미만</FormLabel>
              <Stack direction="row" alignItems="center">
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
                {suffixText}
              </Stack>
            </FormControl>
          </Stack>
          <Center height={isMobileSize ? undefined : '80px'}>
            <Divider orientation={isMobileSize ? 'horizontal' : 'vertical'} />
          </Center>
          <FormControl id="cost">
            <FormLabel>대한민국</FormLabel>
            <Stack direction="row" alignItems="center">
              <Input type="number" {...register('cost', { required: true })} />
              {suffixText}
            </Stack>
          </FormControl>
        </Stack>

        <Stack />
      </Stack>
    </>
  );
}

export default ShippingOptionIntervalApply;
