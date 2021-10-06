import {
  Box,
  Button,
  Checkbox,
  CloseButton,
  Collapse,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useBoolean,
} from '@chakra-ui/react';
import { ShippingCalculType } from '@prisma/client';
import { useDisplaySize } from '@project-lc/hooks';
import { ShippingCalculTypeOptions, ShippingCalculTypes } from '@project-lc/shared-types';
import { useShippingGroupItemStore } from '@project-lc/stores';
import React from 'react';
import DaumPostcode, { AddressData } from 'react-daum-postcode';
import SectionWithTitle from './SectionWithTitle';
import TextWithPopperButton from './TextWithPopperButton';

export function ShippingPolicyFormControlWithLabel({
  id,
  label,
  children,
}: {
  id?: string;
  label: string;
  children: React.ReactNode;
}): JSX.Element {
  const { isMobileSize } = useDisplaySize();
  return (
    <FormControl id={id} mb={6} minW={isMobileSize ? '100%' : 'lg'}>
      <FormLabel fontWeight="bold">{label}</FormLabel>
      {children}
    </FormControl>
  );
}

export function ShippingPolicyBasicInfo(): JSX.Element {
  const [open, setFlag] = useBoolean(false);
  const { isMobileSize } = useDisplaySize();

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
  const handleComplete = (data: AddressData): void => {
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
          <Stack>
            {ShippingCalculTypes.map((key) => {
              const { label, desc } = ShippingCalculTypeOptions[key];
              return (
                <Radio value={key} key={key}>
                  <TextWithPopperButton
                    title={label}
                    iconAriaLabel={label}
                    placement={isMobileSize ? 'bottom' : 'right'}
                  >
                    <Text size="sm">{desc}</Text>
                  </TextWithPopperButton>
                </Radio>
              );
            })}
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
              해당 상품을 배송비 계산 기준인 &apos;무료계산-묶음배송&apos;인 다른 상품과
              주문했을 때,
            </Text>
            <Checkbox
              colorScheme="green"
              isChecked={shippingStdFree}
              onChange={setShippingStdFree}
            >
              해당 상품의 기본 배송비를 무료로 하시겠습니까?
            </Checkbox>
            <Checkbox
              colorScheme="green"
              isChecked={shippingAddFree}
              onChange={setShippingAddFree}
            >
              해당 상품의 추가 배송비를 무료로 하시겠습니까?
            </Checkbox>
          </Stack>
        </ShippingPolicyFormControlWithLabel>
      )}

      {/* 반송지 
      // TODO: 반송지 테이블 생성 후 저장된 반송지 목록 조회 기능 추가
      */}
      <ShippingPolicyFormControlWithLabel label="반송지">
        <Stack spacing={2} alignItems="flex-start">
          {/* 주소검색 collapse */}
          <Collapse in={open} animateOpacity>
            <HStack width="100%" alignItems="flex-start">
              <DaumPostcode onComplete={handleComplete} />
              <CloseButton onClick={setFlag.off} />
            </HStack>
          </Collapse>

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
