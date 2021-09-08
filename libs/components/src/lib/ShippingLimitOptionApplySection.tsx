import { Stack, Text } from '@chakra-ui/react';
import { ShippingOptionSetType } from '@project-lc/shared-types';

export function ShippingLimitOptionApplySection({
  shippingSetType = 'std',
}: {
  shippingSetType?: ShippingOptionSetType;
}): JSX.Element {
  return (
    <Stack>
      <Text>리밋</Text>
      <Text>{shippingSetType}</Text>
    </Stack>
  );
}

export default ShippingLimitOptionApplySection;
