import {
  FormControl,
  FormErrorMessage,
  Grid,
  Input,
  Select,
  VStack,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { banks } from '@project-lc/shared-types';
import { CustomRowItem, SectionHeading } from './BroadcasterSettlementInfoDialog';
import { ImageInput } from './ImageInput';

export function BroadcasterSettlementInfoAccount(): JSX.Element {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <VStack alignItems="stretch">
      <SectionHeading>정산계좌정보</SectionHeading>
      <Grid templateColumns="1fr 3fr" borderTopColor="gray.100" borderTopWidth={1.5}>
        <CustomRowItem
          header="은행"
          body={
            <Select
              id="bank"
              variant="flushed"
              autoComplete="off"
              maxW={200}
              maxLength={10}
              {...register('bank', {
                required: '은행을 반드시 선택해주세요.',
              })}
            >
              {banks.map(({ bankCode, bankName }) => (
                <option key={bankCode} value={bankName}>
                  {bankName}
                </option>
              ))}
            </Select>
          }
        />
        <CustomRowItem
          header="계좌번호"
          body={
            <FormControl isInvalid={!!errors.accountNumber}>
              <Input
                id="number"
                variant="flushed"
                maxW={['inherit', 300, 300, 300]}
                autoComplete="off"
                placeholder="계좌번호를 입력해주세요('-' 제외)"
                {...register('accountNumber', {
                  required: "'-'을 제외하고 숫자만 입력하세요.",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: '계좌번호는 숫자만 가능합니다.',
                  },
                })}
              />
              <FormErrorMessage ml={3} mt={0}>
                {errors.accountNumber && errors.accountNumber.message}
              </FormErrorMessage>
            </FormControl>
          }
        />
        <CustomRowItem
          header="예금주명"
          body={
            <FormControl isInvalid={!!errors.accountHolder}>
              <Input
                id="accountHolder"
                variant="flushed"
                placeholder="예금주명을 입력하세요."
                autoComplete="off"
                maxW={200}
                {...register('accountHolder', {
                  required: '예금주명 입력이 필요합니다.',
                })}
              />
              <FormErrorMessage ml={3} mt={0}>
                {errors.accountHolder && errors.accountHolder.message}
              </FormErrorMessage>
            </FormControl>
          }
        />
        <CustomRowItem
          header="통장사본 이미지 업로드"
          body={
            <FormControl isInvalid={!!errors.settlementAccountImage}>
              <ImageInput
                variant="chakra"
                size="sm"
                handleSuccess={() => {
                  console.log('success');
                }}
                handleError={() => {
                  console.log('error');
                }}
              />
              <FormErrorMessage ml={3} mt={0}>
                {errors.settlementAccountImage && errors.settlementAccountImage.message}
              </FormErrorMessage>
            </FormControl>
          }
        />
      </Grid>
    </VStack>
  );
}

export default BroadcasterSettlementInfoAccount;
