import { Stack, Input, Text } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

export interface ResonSectionProps {
  propname?: any;
}
export function ResonSection({ propname }: ResonSectionProps): JSX.Element {
  const { register } = useFormContext();
  return (
    <Stack>
      <Text>재배송/환불 사유</Text>
      <Input {...register('reason')} />
    </Stack>
  );
}

export default ResonSection;
