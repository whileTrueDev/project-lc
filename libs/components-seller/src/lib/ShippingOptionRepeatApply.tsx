import { Button, FormControl, Input, Select, Stack, Text } from '@chakra-ui/react';
import { ShippingOptType, ShippingSetType } from '@prisma/client';
import { KOREA_PROVINCES } from '@project-lc/components-constants/address';
import { boxStyle } from '@project-lc/components-constants/commonStyleProps';
import { ErrorText } from '@project-lc/components-core/ErrorText';
import FormControlInputWrapper from '@project-lc/components-core/FormControlInputWrapper';
import { ResponsiveDivider } from '@project-lc/components-core/ResponsiveDivider';
import { MAX_COST } from '@project-lc/shared-types';
import { useShippingSetItemStore } from '@project-lc/stores';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { areaSelectStyle } from './ShippingOptionFixedApply';

// 퍼스트몰 구간입력 동작
// - 배송비 부분은 0원이 설정 가능
// - 구간입력의 첫번째 옵션 시작값은 0 고정, 두번째 옵션 시작값은 첫번째 옵션의 마지막값 고정
// - 첫번째 옵션의 배송비는 양수값이어야 함( 0원 불가 )
// - 두번째 옵션의 배송비는 0원 가능

function CostInputWrapper({
  children,
  id,
  suffix,
}: {
  children: React.ReactNode;
  id?: string;
  suffix: string;
}): JSX.Element {
  return (
    <FormControl id={id}>
      <Stack direction="row" alignItems="center">
        {children}
        <Text>{suffix}</Text>
      </Stack>
    </FormControl>
  );
}

type RepeatFormType = {
  firstSectionStart: number;
  firstSectionEnd: number;
  secondSectionEnd: number;
  firstCost: number;
  secondCost: number;
  areaName: string;
};

export function ShippingOptionRepeatApply({
  shippingSetType,
  shippingOptType,
  suffix,
}: {
  shippingSetType: ShippingSetType;
  shippingOptType: ShippingOptType;
  suffix: string;
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
    setValue,
    getValues,
    control,
    watch,
    formState: { errors },
  } = useForm<RepeatFormType>({
    defaultValues: {
      firstSectionStart: 0,
      firstSectionEnd: 1,
      firstCost: 2500,
      secondSectionEnd: 1,
      secondCost: 2500,
      areaName:
        deliveryLimit === 'limit' || shippingSetType === 'add' ? '지역 선택' : '대한민국',
    },
  });

  const shippingOptionBase: any = {
    shipping_set_type: shippingSetType,
    shipping_opt_type: shippingOptType,
    default_yn: null,
  };

  const onSubmit = (): void => {
    const data: RepeatFormType = getValues();
    const {
      firstSectionStart,
      firstSectionEnd,
      firstCost,
      secondSectionEnd,
      secondCost,
      areaName,
    } = data;

    // 2. shippingOption 생성
    const firstOption = {
      ...shippingOptionBase,
      section_st: firstSectionStart,
      section_ed: firstSectionEnd,
      shippingCost: {
        shipping_area_name: areaName,
        shipping_cost: firstCost,
      },
    };
    const secondOption = {
      ...shippingOptionBase,
      section_st: firstSectionEnd,
      section_ed: secondSectionEnd,
      shippingCost: {
        shipping_area_name: areaName,
        shipping_cost: secondCost,
      },
    };
    const newOptions = [firstOption, secondOption];
    // 3. addShippingOption

    if (deliveryLimit === 'limit' || shippingSetType === 'add') {
      // 지역배송인 경우

      // 이미 추가된 지역인지, 인덱스로 확인
      const sameAreaOptIdx = shippingOptions.findIndex(
        (opt) =>
          opt.shippingCost.shipping_area_name === areaName &&
          opt.shipping_set_type === shippingSetType,
      );

      if (sameAreaOptIdx === -1) {
        // 새로운 지역인 경우 추가하기
        newOptions.forEach((opt) => addShippingOption(opt));
      } else {
        // 기존에 추가된 지역과 같은 지역인 경우 덮어쓰기
        newOptions.forEach((opt, idx) => changeShippingOption(sameAreaOptIdx + idx, opt));
      }
    } else {
      // 전국배송인 경우 1개만 설정하도록
      setShippingOptions(newOptions);
    }
  };

  useEffect(() => {
    setValue(
      'areaName',
      deliveryLimit === 'limit' || shippingSetType === 'add' ? '지역 선택' : '대한민국',
    );
  }, [shippingOptType, deliveryLimit, setValue, shippingSetType]);

  return (
    <>
      {errors.firstSectionEnd && <ErrorText>{errors.firstSectionEnd.message}</ErrorText>}
      {errors.secondSectionEnd && (
        <ErrorText>{errors.secondSectionEnd.message}</ErrorText>
      )}
      {errors.firstCost && <ErrorText>{errors.firstCost.message}</ErrorText>}
      {errors.secondCost && <ErrorText>{errors.secondCost.message}</ErrorText>}
      {errors.areaName && <ErrorText>{errors.areaName.message}</ErrorText>}

      <Stack direction="column" as="form" alignItems="center" {...boxStyle}>
        <Stack w="100%" direction="row" justifyContent="space-between">
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
          <Button alignSelf="flex-start" onClick={onSubmit}>
            적용
          </Button>
        </Stack>

        {/* 첫번째 옵션 */}
        <Stack direction={{ base: 'column', sm: 'row' }} {...boxStyle}>
          <Stack direction="row" alignItems="center">
            <FormControlInputWrapper id="firstSectionStart" suffix={`${suffix} 이상`}>
              <Input
                type="number"
                max={MAX_COST}
                readOnly
                {...register('firstSectionStart', {
                  required: '시작값을 입력해주세요',
                  valueAsNumber: true,
                })}
              />
            </FormControlInputWrapper>
            <Text>~</Text>
            <FormControlInputWrapper id="firstSectionEnd" suffix={`${suffix} 미만`}>
              <Input
                type="number"
                max={MAX_COST}
                {...register('firstSectionEnd', {
                  valueAsNumber: true,
                  validate: {
                    positive: (v) => (v ? v >= 0 : true || '음수는 입력할 수 없습니다'),
                    biggerThanSectionStart: (v) => {
                      const sectionStart = getValues('firstSectionStart');
                      return v > sectionStart || '시작값보다 큰 값을 입력해주세요';
                    },
                  },
                })}
              />
            </FormControlInputWrapper>
          </Stack>
          <ResponsiveDivider />
          <CostInputWrapper id="firstCost" suffix="원">
            <Input
              type="number"
              max={MAX_COST}
              {...register('firstCost', {
                required: '배송비를 입력해주세요',
                valueAsNumber: true,
                validate: {
                  positive: (v) => (v ? v >= 0 : true || '음수는 입력할 수 없습니다'),
                },
              })}
            />
          </CostInputWrapper>
        </Stack>
        {/* 첫번째 옵션 */}

        {/* 두번째 옵션 */}
        <Stack direction={{ base: 'column', sm: 'row' }} {...boxStyle}>
          <Stack direction="row" alignItems="center">
            <FormControlInputWrapper id="secondSectionStart" suffix={`${suffix} 부터는`}>
              <Input
                type="number"
                max={MAX_COST}
                readOnly
                value={watch('firstSectionEnd') || 0}
              />
            </FormControlInputWrapper>
            <Text>~</Text>
            <FormControlInputWrapper id="secondSectionEnd" suffix={`${suffix} 당`}>
              <Input
                type="number"
                max={MAX_COST}
                {...register('secondSectionEnd', {
                  valueAsNumber: true,
                  validate: {
                    positive: (v) => (v ? v >= 0 : true || '음수는 입력할 수 없습니다'),
                  },
                })}
              />
            </FormControlInputWrapper>
          </Stack>
          <ResponsiveDivider />
          <CostInputWrapper id="secondCost" suffix="원">
            <Input
              type="number"
              max={MAX_COST}
              maxLength={11}
              {...register('secondCost', {
                required: '배송비를 입력해주세요',
                valueAsNumber: true,
                validate: {
                  positive: (v) => (v ? v >= 0 : true || '음수는 입력할 수 없습니다'),
                },
              })}
            />
          </CostInputWrapper>
        </Stack>
        {/* 두번째 옵션 */}

        <Stack />
      </Stack>
    </>
  );
}

export default ShippingOptionRepeatApply;
