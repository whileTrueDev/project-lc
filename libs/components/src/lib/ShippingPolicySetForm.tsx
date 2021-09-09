/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  TextProps,
  useBoolean,
  useToast,
} from '@chakra-ui/react';
import {
  PrepayInfoOptions,
  PrepayInfoTypes,
  ShippingSetCodeOptions,
  ShippingSetCodes,
} from '@project-lc/shared-types';
import { useShippingSetItemStore } from '@project-lc/stores';
import ShippingOptionApplySection from './ShippingOptionApplySection';

function InputWrapperText({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) {
  return (
    <Stack direction={{ base: 'column', md: 'row' }}>
      <Text width={{ base: '100%', md: '30%' }}>{text}</Text>
      {children}
    </Stack>
  );
}

function BoldText({ children, ...rest }: { children: React.ReactNode } & TextProps) {
  return (
    <Text fontWeight="bold" {...rest}>
      {children}
    </Text>
  );
}

export function ShippingPolicySetForm({
  onSubmit,
}: {
  onSubmit: () => void;
}): JSX.Element {
  // 추가배송비 사용여부
  const [open, { toggle }] = useBoolean();
  const toast = useToast();

  const {
    shippingSetName,
    prepayInfo,
    refundShippingCost,
    swapShippingCost,
    shipingFreeFlag,
    deliveryLimit,
    shippingOptions,
    setShippingSetName,
    setShippingSetCode,
    setPrepayInfo,
    setRefundShippingCost,
    setWwapShippingCost,
    setShipingFreeFlag,
    changeDeliveryLimit,
  } = useShippingSetItemStore();
  // 배송 설정 추가 핸들러
  const addShippingSet = () => {
    if (shippingOptions.length === 0) {
      toast({ title: '배송비 옵션을 1개 이상 적용해야 합니다', status: 'error' });
      return;
    }
    console.log({
      shippingSetName,
      prepayInfo,
      refundShippingCost,
      swapShippingCost,
      shipingFreeFlag,
      deliveryLimit,
      shippingOptions,
    });
    // onSubmit();
  };
  return (
    <>
      <Stack spacing={6}>
        {/* 배송 설정 이름, 배송 설정 코드, 착불/선불 정보 */}
        <Stack className="shippingSetName">
          {/* 배송 설정 이름 */}
          <Stack direction={{ base: 'column', md: 'row' }}>
            <BoldText width={{ base: '100%', md: '30%' }}>배송 설정명</BoldText>
            <Input maxLength={50} value={shippingSetName} onChange={setShippingSetName} />
          </Stack>

          {/* 배송 설정 코드  */}
          <Select onChange={setShippingSetCode}>
            {ShippingSetCodes.map((key) => (
              <option key={ShippingSetCodeOptions[key].label} value={key}>
                {ShippingSetCodeOptions[key].label}
              </option>
            ))}
          </Select>

          {/* 선불/착불정보  */}
          <RadioGroup value={prepayInfo} onChange={setPrepayInfo}>
            <Stack direction="row">
              {PrepayInfoTypes.map((key) => (
                <Radio value={key} key={key}>
                  {PrepayInfoOptions[key].label}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        </Stack>
        {/* 배송 설정 이름, 배송 설정 코드, 착불/선불 정보 */}

        <Divider />

        {/* 반품 배송비 */}
        <Stack className="refundShippingCost" spacing={4}>
          <BoldText>반품 배송비</BoldText>

          <Box>
            <InputWrapperText text="반품 편도">
              <Input
                type="number"
                value={refundShippingCost ? refundShippingCost.toString() : 0}
                onChange={setRefundShippingCost}
              />
            </InputWrapperText>
            <Checkbox onChange={setShipingFreeFlag} isChecked={shipingFreeFlag}>
              배송비가 무료인 경우, 반품배송비 왕복 &nbsp;
              {((refundShippingCost || 0) * 2).toLocaleString()}₩ 받기
            </Checkbox>
          </Box>

          <InputWrapperText text="(맞)교환 왕복">
            <Input
              type="number"
              value={swapShippingCost ? swapShippingCost.toString() : 0}
              onChange={setWwapShippingCost}
            />
          </InputWrapperText>
        </Stack>
        {/* 반품 배송비 */}

        <Divider />

        {/* 기본 배송비 */}
        <Stack>
          <BoldText>기본 배송비</BoldText>
          <RadioGroup value={deliveryLimit} onChange={changeDeliveryLimit}>
            <Stack direction="row">
              <Radio value="unlimit">대한민국 전국배송</Radio>
              <Radio value="limit">대한민국 중 지정 지역 배송</Radio>
            </Stack>
          </RadioGroup>
          <ShippingOptionApplySection />
        </Stack>
        {/* 기본 배송비 */}

        <Divider />

        {/* 추가 배송비 */}
        <Stack>
          <BoldText>추가 배송비</BoldText>
          <Button width="100px" onClick={toggle}>
            {open ? '사용하지 않기' : '설정하기'}
          </Button>
          {open && <ShippingOptionApplySection shippingSetType="add" />}
        </Stack>
        {/* 추가 배송비 */}

        <Divider />

        <Button onClick={addShippingSet}>추가하기</Button>
      </Stack>
    </>
  );
}

export default ShippingPolicySetForm;
