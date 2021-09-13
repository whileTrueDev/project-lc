/* eslint-disable camelcase */
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
import { ShippingCalculType } from '@prisma/client';
import { ShippingCalculTypeOptions, ShippingCalculTypes } from '@project-lc/shared-types';
import { useShippingGroupItemStore } from '@project-lc/stores';
import React from 'react';
import DaumPostcode, { AddressData } from 'react-daum-postcode';
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

  const {
    shipping_group_name: groupName,
    shipping_calcul_type: shippingCalculType,
    baseAddress,
    postalCode,
    detailAddress,
    shipping_std_free_yn,
    shipping_add_free_yn,
    setGroupName,
    setShippingCalculType,
    clearShippingAdditionalSetting,
    setShippingStdFree,
    setShippingAddFree,
    setAddress,
    setDetailAddress,
  } = useShippingGroupItemStore();

  const shippingStdFree = shipping_std_free_yn === 'Y';
  const shippingAddFree = shipping_add_free_yn === 'Y';

  // 배송비 계산 기준

  // 주소검색 결과 타입 참고 https://postcode.map.daum.net/guide
  const handleComplete = (data: AddressData) => {
    const { address, zonecode } = data;
    setAddress(zonecode, address);
    setFlag.off();
  };

  return (
    <SectionWithTitle title="기본정보">
      {/* 배송그룹명 */}
      <ShippingPolicyFormControlWithLabel id="shipping-group-name" label="배송그룹명">
        <Input value={groupName} onChange={setGroupName} maxLength={16} />
      </ShippingPolicyFormControlWithLabel>

      {/* 배송비 계산 기준 */}
      <ShippingPolicyFormControlWithLabel
        id="shipping-calcul-type"
        label="배송비 계산 기준"
      >
        <RadioGroup
          value={shippingCalculType}
          onChange={(nextValue: ShippingCalculType) => {
            if (nextValue === 'free') {
              clearShippingAdditionalSetting();
            }
            setShippingCalculType(nextValue);
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
      </ShippingPolicyFormControlWithLabel>

      {/* 배송비 추가 설정 - 배송비 계산 기준이 '무료계산'일때는 표시하지 않는다 */}
      {shippingCalculType !== 'free' && (
        <ShippingPolicyFormControlWithLabel
          id="shipping-add-setting"
          label="배송비 추가 설정"
        >
          <Stack spacing={2}>
            <Text as="span">
              무료계산-묶음배송 배송그룹이 적용된 상품과 함께 주문하면, 배송그룹으로
              계산된 배송비
            </Text>
            <Stack direction="row">
              <Checkbox
                colorScheme="green"
                isChecked={shippingStdFree}
                onChange={setShippingStdFree}
              >
                기본 무료
              </Checkbox>
              <Checkbox
                colorScheme="green"
                isChecked={shippingAddFree}
                onChange={setShippingAddFree}
              >
                추가 무료
              </Checkbox>
            </Stack>
          </Stack>
        </ShippingPolicyFormControlWithLabel>
      )}

      {/* 반송지 
      // TODO: 반송지 테이블 생성 후 저장된 반송지 목록 조회 기능 추가
      */}
      <ShippingPolicyFormControlWithLabel label="반송지">
        <Stack spacing={2} alignItems="flex-start">
          <Box display={open ? 'block' : 'none'} width="100%">
            <DaumPostcode onComplete={handleComplete} />
          </Box>
          <Stack direction="row">
            <Input
              id="base-return-address"
              readOnly
              placeholder="우편번호"
              defaultValue={postalCode}
            />
            <Button onClick={setFlag.toggle}>반송지 설정</Button>
          </Stack>

          <Input
            id="detail-return-address"
            defaultValue={baseAddress}
            readOnly
            placeholder="주소"
          />
          <Input
            id="postal-code-return-address"
            placeholder="상세주소"
            maxLength={255}
            value={detailAddress}
            onChange={setDetailAddress}
          />
        </Stack>
      </ShippingPolicyFormControlWithLabel>
    </SectionWithTitle>
  );
}

export default ShippingPolicyBasicInfo;
