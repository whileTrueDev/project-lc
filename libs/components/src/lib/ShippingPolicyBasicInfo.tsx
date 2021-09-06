/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  Heading,
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
import { ShippingCalculType } from '@project-lc/shared-types';
import React from 'react';
import DaumPostcode, { AddressData } from 'react-daum-postcode';
import { useFormContext, Controller } from 'react-hook-form';

const ShippingCalculTypes: ShippingCalculType[] = ['bundle', 'each', 'free'];
const ShippingCalculTypeOptions: Record<ShippingCalculType, { label: string }> = {
  bundle: { label: '묶음계산-묶음배송' },
  each: { label: '개별계산-개별배송' },
  free: { label: '무료계산-묶음배송' },
};

function ShippingPolicyFormControlWithLabel({
  id,
  label,
  children,
}: {
  id?: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <FormControl id={id}>
      <FormLabel fontWeight="bold">{label}</FormLabel>
      {children}
    </FormControl>
  );
}

export function ShippingPolicyBasicInfo(): JSX.Element {
  const [open, setFlag] = useBoolean(false);
  const { register, watch, setValue, control } = useFormContext();

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
    <Stack spacing={4}>
      <Heading as="h4" size="md" colorScheme="blue" mb={2}>
        기본정보
      </Heading>

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
          render={({ field }) => (
            <RadioGroup {...field}>
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

      {/* 배송비 추가 설정 */}
      <ShippingPolicyFormControlWithLabel
        id="shipping-add-setting"
        label="배송비 추가 설정"
      >
        <Stack spacing={10} direction="row">
          <Text as="span">
            무료계산-묶음배송 배송그룹이 적용된 상품과 함께 주문하면, 배송그룹으로 계산된
            배송비
          </Text>
          <Checkbox colorScheme="green" {...register('shippingStdFree')}>
            기본 무료
          </Checkbox>
          <Checkbox colorScheme="green" {...register('shippingAddFree')}>
            추가 무료
          </Checkbox>
        </Stack>
      </ShippingPolicyFormControlWithLabel>

      {/* 반송지 */}
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
    </Stack>
  );
}

export default ShippingPolicyBasicInfo;
