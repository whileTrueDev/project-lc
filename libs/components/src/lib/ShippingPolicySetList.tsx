import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { ShippingSetFormData } from '@project-lc/shared-types';
import { useShippingGroupItemStore } from '@project-lc/stores';
import SectionWithTitle from './SectionWithTitle';

export function ShippingPolicySetList(): JSX.Element {
  const { shippingSets, removeShippingSet } = useShippingGroupItemStore();
  return (
    <SectionWithTitle title="배송 방법">
      {/* 배송 옵션 목록(임시) */}
      <Box>
        {shippingSets.map((set: ShippingSetFormData) => (
          <Stack direction="row" key={set.tempId}>
            <Text>{JSON.stringify(set, null, 2)}</Text>
            <Button onClick={() => removeShippingSet(set.tempId)}>삭제</Button>
          </Stack>
        ))}
      </Box>
    </SectionWithTitle>
  );
}

export default ShippingPolicySetList;
