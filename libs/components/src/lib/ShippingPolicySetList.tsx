import { Box, Button, Heading, Select, Stack, Text, useBoolean } from '@chakra-ui/react';
import {
  ShippingCalculType,
  ShippingCalculTypeOptions,
  ShippingPolicyFormData,
  ShippingSetCodeOptions,
  ShippingSetCodes,
  ShippingSetFormData,
} from '@project-lc/shared-types';
import { useFormContext } from 'react-hook-form';
import SectionWithTitle from './SectionWithTitle';
import ShippingPolicySetForm from './ShippingPolicySetForm';

export function ShippingPolicySetList(): JSX.Element {
  const [open, { on, off, toggle }] = useBoolean(true);
  // 배송정책그룹 폼 컨텍스트
  const { register, watch, setValue, control, getValues } =
    useFormContext<ShippingPolicyFormData>();

  // 배송 설정 목록
  const shippingSets = watch('shippingSets') || [];
  const deleteTempSet = (id: number) => {
    const prevSets = getValues('shippingSets');
    setValue(
      'shippingSets',
      prevSets.filter((set) => set.tempId !== id),
    );
  };
  return (
    <SectionWithTitle title="배송가능국가 : 대한민국">
      <Box>
        {shippingSets.map((set: ShippingSetFormData) => (
          <Stack direction="row" key={set.tempId}>
            <Text>{JSON.stringify(set, null, 2)}</Text>
            <Button onClick={() => deleteTempSet(set.tempId)}>삭제</Button>
          </Stack>
        ))}
      </Box>

      <Button onClick={toggle}>{open ? '닫기' : '추가하기'}</Button>
      {open && <ShippingPolicySetForm onSubmit={off} />}
    </SectionWithTitle>
  );
}

export default ShippingPolicySetList;
