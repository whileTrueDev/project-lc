import {
  Button,
  Collapse,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  useBoolean,
} from '@chakra-ui/react';
import { useDefaultCustomerAddress, useProfile } from '@project-lc/hooks';
import { banks } from '@project-lc/shared-types';
import { useCallback, useEffect } from 'react';
import DaumPostcode, { AddressData } from 'react-daum-postcode';
import { useFormContext } from 'react-hook-form';

export type Solution =
  // 재배송(=수거없는 교환)
  | 'exchange'
  // 환불(=수거없는 반품)
  | 'return'; //
export function SolutionSection(): JSX.Element {
  const { setValue, watch } = useFormContext();
  return (
    <Stack spacing={4}>
      <Text fontWeight="bold">해결방법</Text>
      <RadioGroup
        onChange={(value) => setValue('solution', value)}
        value={watch('solution') || 'exchange'}
      >
        <Stack spacing={3}>
          <Radio value="exchange">상품을 재배송 받고 싶어요</Radio>
          <Radio value="return">환불 받고 싶어요</Radio>
        </Stack>
      </RadioGroup>
      {watch('solution') === 'exchange' && <ReExportRequestSection />}
      {watch('solution') === 'return' && <RefundOnlyRequestSection />}
    </Stack>
  );
}

export default SolutionSection;

export function ReExportRequestSection(): JSX.Element {
  const [open, { toggle }] = useBoolean();
  const { register, setValue } = useFormContext();
  const handleComplete = (data: AddressData): void => {
    const { address, zonecode } = data;
    setValue('recipientAddress', address);
    setValue('recipientPostalCode', zonecode);
    setValue('recipientDetailAddress', '');
    toggle();
  };

  const { data: profileData } = useProfile();
  const { data: defaultAddress } = useDefaultCustomerAddress(profileData?.id);

  const setDefaultAddress = useCallback(() => {
    if (defaultAddress) {
      const { address, detailAddress, postalCode } = defaultAddress;
      setValue('recipientAddress', address);
      setValue('recipientPostalCode', postalCode);
      setValue('recipientDetailAddress', detailAddress);
    }
  }, [defaultAddress, setValue]);

  useEffect(() => {
    setDefaultAddress();
  }, [setDefaultAddress]);

  return (
    <Stack>
      <Text>상품을 재배송받을 주소를 입력해주세요</Text>
      <Stack direction="row">
        <Button onClick={toggle}>새 주소 입력</Button>
        <Button onClick={setDefaultAddress}>기본주소사용</Button>
      </Stack>
      <Collapse in={open} animateOpacity>
        <DaumPostcode onComplete={handleComplete} />
      </Collapse>
      <Input readOnly {...register('recipientAddress')} />
      <Input readOnly {...register('recipientPostalCode')} />
      <Stack direction="row">
        <Text minWidth="70px">상세주소</Text>
        <Input {...register('recipientDetailAddress')} />
      </Stack>

      <Text>배송요청사항(100자 이내)</Text>
      <Input maxLength={100} {...register('recipientShippingMemo')} />
    </Stack>
  );
}

export function RefundOnlyRequestSection(): JSX.Element {
  const { register } = useFormContext();
  return (
    <Stack>
      <Text>환불받을 은행 계좌를 입력해주세요</Text>
      <Select {...register('returnBank')}>
        {banks.map((bank) => (
          <option key={bank.bankCode}>{bank.bankName}</option>
        ))}
      </Select>
      <Text>계좌번호</Text>
      <Input type="number" {...register('returnBankAccount')} />
    </Stack>
  );
}
