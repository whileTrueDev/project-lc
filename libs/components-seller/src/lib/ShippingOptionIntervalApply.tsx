import { Button, FormControl, Input, Select, Stack, Text } from '@chakra-ui/react';
import { ShippingOptType, ShippingSetType } from '@prisma/client';
import { KOREA_PROVINCES } from '@project-lc/components-constants/address';
import { boxStyle } from '@project-lc/components-constants/commonStyleProps';
import { ErrorText } from '@project-lc/components-core/ErrorText';
import FormControlInputWrapper from '@project-lc/components-core/FormControlInputWrapper';
import { ResponsiveDivider } from '@project-lc/components-core/ResponsiveDivider';
import { MAX_COST, ShippingCostDto, ShippingOptionDto } from '@project-lc/shared-types';
import { useShippingSetItemStore } from '@project-lc/stores';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { areaSelectStyle } from './ShippingOptionFixedApply';

type IntervalFormType = Pick<ShippingOptionDto, 'section_ed'> & ShippingCostDto;
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
    control,
    setValue,
    setError,
    getValues,
    formState: { errors },
    trigger,
  } = useForm<IntervalFormType>({
    defaultValues: {
      section_ed: null,
      shipping_cost: 2500,
      shipping_area_name:
        deliveryLimit === 'limit' || shippingSetType === 'add' ? '지역 선택' : '대한민국',
    },
  });

  const [sectionStart, setSectionStart] = useState<number>(0);

  const { addShippingOption, shippingOptions, setShippingOptions } =
    useShippingSetItemStore();

  const onSubmit = async (): Promise<void> => {
    // handleSubmit 이 아닌 onClick 이벤트 핸들러를 사용(상품등록 폼 내에 해당 폼이 존재하여 submit 이벤트가 버블링됨)
    // trigger로 validation 체크 필요
    const validationPassed = await trigger();
    if (!validationPassed) return;

    const data: IntervalFormType = getValues();
    const { section_ed, shipping_cost, shipping_area_name } = data;
    if (shipping_area_name === '지역 선택') {
      return;
    }

    // 기본배송비 옵션이고 && 현재 입력하려는 옵션의 배송비가 0원이고 && 이전 입력된 옵션의 배송비가 모두 0원인경우 에러
    if (
      shippingSetType === 'std' &&
      shipping_cost === 0 &&
      shippingOptions.every((opt) => opt.shippingCost.shipping_cost === 0)
    ) {
      setError('shipping_cost', {
        type: 'manual',
        message: '기본 배송비가 모두 0원입니다. 배송비를 입력해주세요.',
      });
      return;
    }

    const option: Omit<ShippingOptionDto, 'tempId'> = {
      default_yn: null,
      shipping_set_type: shippingSetType,
      shipping_opt_type: shippingOptType,
      section_st: sectionStart,
      section_ed,
      shippingCost: {
        shipping_cost,
        shipping_area_name,
      },
    };

    // 입력하는 구간시작값이 0 이고, 마지막 입력된 옵션의 구간시작값이 0인 경우 마지막 옵션을 덮어씀
    // 아닌경우 옵션 추가함
    if (
      sectionStart === 0 &&
      shippingOptions.length !== 0 &&
      shippingOptions[shippingOptions.length - 1].section_st === 0
    ) {
      setShippingOptions([...shippingOptions.slice(0, -1), option]);
    } else {
      addShippingOption(option);
    }
  };

  useEffect(() => {
    // 이미 추가된 옵션이 있다면 시작값을 이전 옵션의 종료값으로 설정
    if (shippingOptions.length > 0) {
      setSectionStart(shippingOptions[shippingOptions.length - 1].section_ed || 0);
    }
    // 추가된 옵션이 없다면 구간시작값 0으로 설정
    if (shippingOptions.length === 0) {
      setSectionStart(0);
    }

    setValue('section_ed', null);
  }, [shippingOptions, setValue]);

  useEffect(() => {
    setValue(
      'shipping_area_name',
      deliveryLimit === 'limit' || shippingSetType === 'add' ? '지역 선택' : '대한민국',
    );
  }, [deliveryLimit, setValue, shippingOptType, shippingSetType]);

  return (
    <>
      {errors.section_ed && <ErrorText>{errors.section_ed.message}</ErrorText>}
      {errors.shipping_cost && <ErrorText>{errors.shipping_cost.message}</ErrorText>}
      {errors.shipping_area_name && (
        <ErrorText>{errors.shipping_area_name.message}</ErrorText>
      )}
      <Stack direction="row" as="form" alignItems="center" {...boxStyle}>
        <Stack direction={{ base: 'column', sm: 'row' }}>
          {/* 범위 지정 */}
          <Stack direction="row" alignItems="center">
            {/* 첫번째 범위 인풋 */}
            <FormControlInputWrapper id="section_st" suffix={`${suffix} 이상`}>
              <Input type="number" max={MAX_COST} readOnly value={sectionStart} />
            </FormControlInputWrapper>
            <Text>~</Text>
            {/* 두번째 범위 인풋 */}
            <FormControlInputWrapper id="section_ed" suffix={`${suffix} 미만`}>
              <Input
                type="number"
                max={MAX_COST}
                {...register('section_ed', {
                  valueAsNumber: true,
                  validate: {
                    positive: (v) => (v ? v >= 0 : true || '음수는 입력할 수 없습니다'),
                    biggerThanSectionStart: (v) => {
                      return (
                        (v ? v > sectionStart : true) || '시작값보다 큰 값을 입력해주세요'
                      );
                    },
                  },
                })}
              />
            </FormControlInputWrapper>
          </Stack>
          <ResponsiveDivider />

          {/* 지역, 가격 설정 */}
          <Stack justifyContent="center">
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
            {/* 가격 설정 */}
            <FormControl id="shipping_cost">
              <Stack direction="row" alignItems="center">
                <Input
                  type="number"
                  max={MAX_COST}
                  {...register('shipping_cost', {
                    required: '배송비를 입력해주세요',
                    valueAsNumber: true,
                    validate: {
                      positive: (v) => v >= 0 || '음수는 입력할 수 없습니다',
                    },
                  })}
                />
                <Text>원</Text>
              </Stack>
            </FormControl>
          </Stack>
        </Stack>

        <Button onClick={onSubmit}>적용</Button>
      </Stack>
    </>
  );
}

export default ShippingOptionIntervalApply;
