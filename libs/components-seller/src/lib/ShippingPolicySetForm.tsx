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
  useBoolean,
} from '@chakra-ui/react';
import { BoldText } from '@project-lc/components-core/BoldText';
import { useAddShippingSetHandler } from '@project-lc/hooks';
import {
  PrepayInfoOptions,
  PrepayInfoTypes,
  ShippingSetCodeOptions,
  ShippingSetCodes,
} from '@project-lc/shared-types';
import { useShippingSetItemStore } from '@project-lc/stores';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import { useEffect } from 'react';
import ShippingOptionApplySection from './ShippingOptionApplySection';

function InputWrapperText({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <Stack direction={{ base: 'column', md: 'row' }}>
      <Text width={{ base: '100%', md: '30%' }}>{text}</Text>
      {children}
    </Stack>
  );
}

export function ShippingPolicySetForm({
  onSubmit,
}: {
  onSubmit: () => void;
}): JSX.Element {
  const {
    shipping_set_name,
    prepay_info,
    refund_shiping_cost,
    swap_shiping_cost,
    shiping_free_yn,
    delivery_limit,
    setShippingSetName,
    setShippingSetCode,
    setPrepayInfo,
    setRefundShippingCost,
    setSwapShippingCost,
    setShipingFreeFlag,
    changeDeliveryLimit,
    clearShippingOptions,
  } = useShippingSetItemStore();

  // 추가배송비 사용여부
  const [open, { toggle }] = useBoolean();

  useEffect(() => {
    // open === false일때 추가배송비 초기화
    if (open === false) {
      clearShippingOptions('add');
    }
  }, [clearShippingOptions, open]);

  // 배송 설정 추가 핸들러
  const { addShippingSetHandler } = useAddShippingSetHandler({ onSubmit });
  return (
    <>
      <Stack spacing={6}>
        {/* 배송 설정 이름, 배송 설정 코드, 착불/선불 정보 */}
        <Stack className="shippingSetName">
          {/* 배송 설정 이름 */}
          <Stack direction={{ base: 'column', md: 'row' }}>
            <BoldText width={{ base: '100%', md: '30%' }}>배송 설정명</BoldText>
            <Input
              maxLength={50}
              value={shipping_set_name}
              onChange={setShippingSetName}
            />
          </Stack>

          {/* 배송 설정 코드 Select- 택배, 퀵서비스, 직접배송 등등 */}
          <Select onChange={setShippingSetCode}>
            {ShippingSetCodes.map((key) => (
              <option key={ShippingSetCodeOptions[key].label} value={key}>
                {ShippingSetCodeOptions[key].label}
              </option>
            ))}
          </Select>

          {/* 선불/착불정보 Radio */}
          <RadioGroup value={prepay_info} onChange={setPrepayInfo}>
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
                value={refund_shiping_cost ? refund_shiping_cost.toString() : 0}
                onChange={setRefundShippingCost}
              />
            </InputWrapperText>
            <Checkbox onChange={setShipingFreeFlag} isChecked={shiping_free_yn === 'Y'}>
              배송비가 무료인 경우, 반품배송비 왕복 &nbsp;
              {getLocaleNumber((refund_shiping_cost || 0) * 2)}₩ 받기
            </Checkbox>
          </Box>

          <InputWrapperText text="(맞)교환 왕복">
            <Input
              type="number"
              value={swap_shiping_cost ? swap_shiping_cost.toString() : 0}
              onChange={setSwapShippingCost}
            />
          </InputWrapperText>
        </Stack>
        {/* 반품 배송비 */}

        <Divider />

        {/* 기본 배송비 */}
        <Stack>
          <BoldText>기본 배송비</BoldText>
          <RadioGroup value={delivery_limit} onChange={changeDeliveryLimit}>
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
          <Stack direction="row" alignItems="center">
            <BoldText>추가 배송비</BoldText>
            <Button width="100px" onClick={toggle}>
              {open ? '사용하지 않기' : '설정하기'}
            </Button>
          </Stack>

          {open && <ShippingOptionApplySection shippingSetType="add" />}
        </Stack>
        {/* 추가 배송비 */}

        <Divider />

        <Button onClick={addShippingSetHandler}>추가하기</Button>
      </Stack>
    </>
  );
}

export default ShippingPolicySetForm;
