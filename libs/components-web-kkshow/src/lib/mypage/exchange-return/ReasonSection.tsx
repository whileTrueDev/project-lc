import { FormControl, FormErrorMessage, Text, Textarea } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

export function ReasonSection(): JSX.Element {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <FormControl isInvalid={!!errors.reason}>
      <Text fontWeight="bold">재배송/환불 사유</Text>
      <Textarea
        resize="none"
        maxLength={255}
        placeholder="재배송 혹은 환불 요청 사유를 입력해주세요(255자 이내)"
        {...register('reason', { required: '사유를 입력해주세요' })}
      />
      <FormErrorMessage>{errors.reason && errors.reason.message}</FormErrorMessage>
    </FormControl>
  );
}

export default ReasonSection;
