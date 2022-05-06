import { Stack, Text, Textarea } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

export function ReasonSection(): JSX.Element {
  const { register } = useFormContext();
  return (
    <Stack>
      <Text fontWeight="bold">재배송/환불 사유</Text>
      <Textarea
        resize="none"
        maxLength={255}
        placeholder="재배송 혹은 환불 요청 사유를 입력해주세요(255자 이내)"
        {...register('reason')}
      />
    </Stack>
  );
}

export default ReasonSection;
