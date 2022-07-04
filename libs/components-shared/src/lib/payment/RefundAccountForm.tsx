import {
  Text,
  Stack,
  FormControl,
  FormLabel,
  Select,
  FormErrorMessage,
  Input,
} from '@chakra-ui/react';
import { RefundAccountDto, banks } from '@project-lc/shared-types';
import { useFormContext } from 'react-hook-form';

export function RefundAccountForm(): JSX.Element {
  const {
    register,
    formState: { errors },
  } = useFormContext<RefundAccountDto>();

  return (
    <Stack p={2} borderWidth="thin" rounded="md">
      <Text fontWeight="bold">환불계좌 정보입력 (가상계좌결제건)</Text>
      <Text fontSize="sm">환불계좌정보를 신중히 입력해주세요.</Text>
      <FormControl isInvalid={!!errors.refundBank}>
        <FormLabel fontSize="sm" my={0}>
          은행
        </FormLabel>
        <Select
          id="bank"
          autoComplete="off"
          maxW={200}
          maxLength={10}
          size="sm"
          placeholder="환불은행을 선택하세요."
          {...register('refundBank', {
            required: '은행을 반드시 선택해주세요.',
          })}
        >
          {banks.map(({ bankCode, bankName }) => (
            <option key={bankCode} value={bankName}>
              {bankName}
            </option>
          ))}
        </Select>
        <FormErrorMessage fontSize="xs">{errors.refundBank?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.refundAccount}>
        <FormLabel fontSize="sm" my={0}>
          계좌번호
        </FormLabel>
        <Input
          id="refundAccount"
          size="sm"
          autoComplete="off"
          maxW={200}
          placeholder="계좌번호를 입력하세요.(숫자만)"
          {...register('refundAccount', {
            required: '계좌번호를 반드시 입력해주세요.',
            pattern: {
              value: /^[0-9]+$/,
              message: '계좌번호는 숫자만 가능합니다.',
            },
          })}
        />
        <FormErrorMessage fontSize="xs">{errors.refundAccount?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.refundAccountHolder}>
        <FormLabel fontSize="sm" my={0}>
          예금주
        </FormLabel>
        <Input
          id="refundAccountHolder"
          size="sm"
          placeholder="예금주를 입력하세요."
          autoComplete="off"
          maxW={200}
          {...register('refundAccountHolder', {
            required: '예금주를 반드시 입력해주세요.',
          })}
        />
        <FormErrorMessage fontSize="xs">
          {errors.refundAccountHolder && errors.refundAccountHolder.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  );
}
