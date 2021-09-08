/* eslint-disable react/jsx-props-no-spreading */
import {
  Stack,
  Button,
  FormControl,
  FormLabel,
  Input,
  Center,
  Divider,
  Text,
} from '@chakra-ui/react';
import { useDisplaySize } from '@project-lc/hooks';
import {
  ShippingCost,
  ShippingOptionSetType,
  ShippingOptionType,
} from '@project-lc/shared-types';
import { useShippingSetItemStore } from '@project-lc/stores';
import { useForm } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { ErrorText } from './ShippingOptionIntervalApply';

function SectionInputWrapper({
  children,
  id,
  suffix,
}: {
  children: React.ReactNode;
  id?: string;
  suffix: string;
}) {
  return (
    <FormControl id={id}>
      <Stack>
        {children}
        <Stack direction="row" justifyContent="flex-end">
          <Text>{suffix}</Text>
        </Stack>
      </Stack>
    </FormControl>
  );
}

function CostInputWrapper({
  children,
  id,
  suffix,
}: {
  children: React.ReactNode;
  id?: string;
  suffix: string;
}) {
  return (
    <FormControl id={id}>
      <FormLabel>대한민국</FormLabel>
      <Stack direction="row" alignItems="center">
        {children}
        <Text>{suffix}</Text>
      </Stack>
    </FormControl>
  );
}

type RepeatFormType = {
  firstSectionStart: null | number;
  firstSectionEnd: null | number;
  secondSectionStart: null | number;
  secondSectionEnd: null | number;
  firstCost: number;
  secondCost: number;
};

const defaultValues: RepeatFormType = {
  firstSectionStart: 1,
  firstSectionEnd: 2,
  firstCost: 2500,
  secondSectionStart: 2,
  secondSectionEnd: 1,
  secondCost: 2500,
};

export function ShippingOptionRepeatApply({
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
  } = useForm<RepeatFormType>({
    defaultValues,
  });

  const costItemBase = {
    tempId: 0,
    areaName: '대한민국',
  };

  const shippingOptionBase = {
    shippingSetType,
    shippingOptType,
  };

  const { setShippingOptions, shippingOptions } = useShippingSetItemStore();
  const onSubmit = (data: RepeatFormType) => {
    const {
      firstSectionStart,
      firstSectionEnd,
      firstCost,
      secondSectionStart,
      secondSectionEnd,
      secondCost,
    } = data;
    // 1. costItem 생성
    const firstCostItem: ShippingCost = {
      ...costItemBase,
      cost: firstCost,
    };
    const secondCostItem: ShippingCost = {
      ...costItemBase,
      cost: secondCost,
    };
    // 2. shippingOption 생성
    const firstOption = {
      ...shippingOptionBase,
      sectionStart: firstSectionStart,
      sectionEnd: firstSectionEnd,
      costItem: firstCostItem,
    };
    const secondOption = {
      ...shippingOptionBase,
      sectionStart: secondSectionStart,
      sectionEnd: secondSectionEnd,
      costItem: secondCostItem,
    };
    // 3. addShippingOption
    setShippingOptions([firstOption, secondOption]);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(defaultValues);
    }
  }, [reset, isSubmitSuccessful, shippingOptions]);

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shippingOptType]);

  const divider = useMemo(
    () => (
      <Center height={isMobileSize ? undefined : '80px'}>
        <Divider orientation={isMobileSize ? 'horizontal' : 'vertical'} />
      </Center>
    ),
    [isMobileSize],
  );

  return (
    <>
      {errors.firstSectionStart && (
        <ErrorText>{errors.firstSectionStart.message}</ErrorText>
      )}
      {errors.firstSectionEnd && <ErrorText>{errors.firstSectionEnd.message}</ErrorText>}
      {errors.secondSectionStart && (
        <ErrorText>{errors.secondSectionStart.message}</ErrorText>
      )}
      {errors.secondSectionEnd && (
        <ErrorText>{errors.secondSectionEnd.message}</ErrorText>
      )}
      {errors.firstCost && <ErrorText>{errors.firstCost.message}</ErrorText>}
      {errors.secondCost && <ErrorText>{errors.secondCost.message}</ErrorText>}

      <Stack
        direction="column"
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        alignItems="center"
      >
        <Button type="submit" alignSelf="flex-start">
          적용
        </Button>
        {/* 첫번째 옵션 */}
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          border="1px"
          borderColor="gray.200"
          borderRadius="md"
          p={2}
        >
          <Stack direction="row" alignItems="center">
            <SectionInputWrapper id="firstSectionStart" suffix={`${suffix} 이상`}>
              <Input
                type="number"
                {...register('firstSectionStart', {
                  required: '시작값을 입력해주세요',
                  valueAsNumber: true,
                  validate: {
                    positive: (v) => (v && v > 0) || '양수를 입력해주세요',
                  },
                })}
              />
            </SectionInputWrapper>
            <Text>~</Text>
            <SectionInputWrapper id="firstSectionEnd" suffix={`${suffix} 미만`}>
              <Input
                type="number"
                {...register('firstSectionEnd', {
                  valueAsNumber: true,
                  validate: {
                    positive: (v) => (v && v > 0) || '양수를 입력해주세요',
                    biggerThanSectionStart: (v) => {
                      const sectionStart = getValues('firstSectionStart');
                      return (
                        (sectionStart && v && v > sectionStart) ||
                        '시작값보다 큰 값을 입력해주세요'
                      );
                    },
                  },
                })}
              />
            </SectionInputWrapper>
          </Stack>
          {divider}
          <CostInputWrapper id="firstCost" suffix={suffix}>
            <Input type="number" {...register('firstCost', { required: true })} />
          </CostInputWrapper>
        </Stack>
        {/* 첫번째 옵션 */}

        {/* 두번째 옵션 */}
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          border="1px"
          borderColor="gray.200"
          borderRadius="md"
          p={2}
        >
          <Stack direction="row" alignItems="center">
            <SectionInputWrapper id="secondSectionStart" suffix={`${suffix} 부터는`}>
              <Input
                type="number"
                {...register('secondSectionStart', {
                  required: '시작값을 입력해주세요',
                  valueAsNumber: true,
                  validate: {
                    positive: (v) => (v && v > 0) || '양수를 입력해주세요',
                  },
                })}
              />
            </SectionInputWrapper>
            <Text>~</Text>
            <SectionInputWrapper id="secondSectionEnd" suffix={`${suffix} 당`}>
              <Input
                type="number"
                {...register('secondSectionEnd', {
                  valueAsNumber: true,
                  validate: {
                    positive: (v) => (v && v > 0) || '양수를 입력해주세요',
                  },
                })}
              />
            </SectionInputWrapper>
          </Stack>
          {divider}
          <CostInputWrapper id="secondCost" suffix={suffix}>
            <Input type="number" {...register('secondCost', { required: true })} />
          </CostInputWrapper>
        </Stack>
        {/* 두번째 옵션 */}

        <Stack />
      </Stack>
    </>
  );
}

export default ShippingOptionRepeatApply;
