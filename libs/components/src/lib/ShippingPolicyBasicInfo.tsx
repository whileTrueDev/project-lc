/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  Stack,
  FormControl,
  FormLabel,
  Input,
  RadioGroup,
  Radio,
  Checkbox,
  Button,
  Text,
  useBoolean,
} from '@chakra-ui/react';
import { ShippingCalculTypeOptions, ShippingCalculTypes } from '@project-lc/shared-types';
import React from 'react';
import DaumPostcode, { AddressData } from 'react-daum-postcode';
import { useFormContext, Controller } from 'react-hook-form';
import SectionWithTitle from './SectionWithTitle';

export function ShippingPolicyFormControlWithLabel({
  id,
  label,
  children,
}: {
  id?: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <FormControl id={id} mb={6}>
      <FormLabel fontWeight="bold">{label}</FormLabel>
      {children}
    </FormControl>
  );
}

export function ShippingPolicyBasicInfo(): JSX.Element {
  const [open, setFlag] = useBoolean(false);
  const { register, watch, setValue, control } = useFormContext();

  // 배송비 계산 기준
  const shippingCalculType = watch('shippingCalculType');

  const baseAddress = watch('baseAddress');
  const postalCode = watch('postalCode');

  // 주소검색 결과 타입 참고 https://postcode.map.daum.net/guide
  const handleComplete = (data: AddressData) => {
    const { address, zonecode } = data;
    setValue('baseAddress', address);
    setValue('postalCode', zonecode);
    setFlag.off();
  };

  return (
    <SectionWithTitle title="기본정보">
      {/* 배송그룹명 */}
      <ShippingPolicyFormControlWithLabel id="shipping-group-name" label="배송그룹명">
        <Input {...register('groupName')} />
      </ShippingPolicyFormControlWithLabel>

      {/* 배송비 계산 기준 */}
      <ShippingPolicyFormControlWithLabel
        id="shipping-calcul-type"
        label="배송비 계산 기준"
      >
        <Controller
          control={control}
          name="shippingCalculType"
          render={({ field: { onChange, ...rest } }) => (
            <RadioGroup
              {...rest}
              defaultValue="bundle"
              onChange={(nextValue: string) => {
                onChange(nextValue);
                if (nextValue === 'free') {
                  setValue('shippingStdFree', false);
                  setValue('shippingAddFree', false);
                }
              }}
            >
              <Stack direction="row">
                {ShippingCalculTypes.map((key) => (
                  <Radio value={key} key={key}>
                    {ShippingCalculTypeOptions[key].label}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          )}
        />
      </ShippingPolicyFormControlWithLabel>

      {/* 배송비 추가 설정 - 배송비 계산 기준이 '무료계산'일때는 표시하지 않는다 */}
      {shippingCalculType !== 'free' && (
        <ShippingPolicyFormControlWithLabel
          id="shipping-add-setting"
          label="배송비 추가 설정"
        >
          <Stack spacing={10} direction="row">
            <Text as="span">
              무료계산-묶음배송 배송그룹이 적용된 상품과 함께 주문하면, 배송그룹으로
              계산된 배송비
            </Text>
            <Checkbox colorScheme="green" {...register('shippingStdFree')}>
              기본 무료
            </Checkbox>
            <Checkbox colorScheme="green" {...register('shippingAddFree')}>
              추가 무료
            </Checkbox>
          </Stack>
        </ShippingPolicyFormControlWithLabel>
      )}

      {/* 반송지 
      // TODO: 반송지 테이블 생성 후 저장된 반송지 목록 조회 기능 추가
      */}
      <ShippingPolicyFormControlWithLabel label="반송지">
        <Stack spacing={2} alignItems="flex-start">
          <Button onClick={setFlag.toggle}>반송지 설정</Button>
          <Box display={open ? 'block' : 'none'} width="100%">
            <DaumPostcode onComplete={handleComplete} />
          </Box>
          <Input
            id="base-return-address"
            defaultValue={baseAddress}
            readOnly
            placeholder="우편번호"
          />
          <Input
            id="detail-return-address"
            defaultValue={postalCode}
            readOnly
            placeholder="주소"
          />
          <Input
            id="postal-code-return-address"
            placeholder="상세주소"
            {...register('detailAddress')}
          />
        </Stack>
      </ShippingPolicyFormControlWithLabel>
    </SectionWithTitle>
  );
}

export default ShippingPolicyBasicInfo;
