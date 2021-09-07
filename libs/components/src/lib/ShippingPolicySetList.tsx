import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { ShippingPolicyFormData, ShippingSetFormData } from '@project-lc/shared-types';
import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import SectionWithTitle from './SectionWithTitle';

export function ShippingPolicySetList(): JSX.Element {
  const methods = useFormContext<ShippingPolicyFormData>();

  const shippingSets = methods.watch('shippingSets') || [];
  const shippingSetDeleteHandler = useCallback(
    (id: number) => {
      const prevSets = methods.getValues('shippingSets');
      methods.setValue(
        'shippingSets',
        prevSets.filter((set) => set.tempId !== id),
      );
    },
    [methods],
  );

  return (
    <SectionWithTitle title="배송 방법">
      {/* 배송 옵션 목록(임시) */}
      <Box>
        {shippingSets.map((set: ShippingSetFormData) => (
          <Stack direction="row" key={set.tempId}>
            <Text>{JSON.stringify(set, null, 2)}</Text>
            <Button onClick={() => shippingSetDeleteHandler(set.tempId)}>삭제</Button>
          </Stack>
        ))}
      </Box>
    </SectionWithTitle>
  );
}

export default ShippingPolicySetList;
