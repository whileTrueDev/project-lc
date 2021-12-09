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
import { useCallback } from 'react';
import { GridRowLayout, SectionHeading } from './BroadcasterSettlementInfoDialog';
import { ImageInput, ImageInputErrorTypes } from './ImageInput';

type AccountImage = {
  accountImageFile: File | null;
  accountImageName: string | null;
};
// 정산계좌정보 입력폼 데이터 타입
export type BroadcasterAccountData = {
  bank: string;
  accountNumber: number;
  accountHolder: string;
} & AccountImage;

export function BroadcasterSettlementInfoAccount(): JSX.Element {
  const {
    register,
    setValue,
    clearErrors,
    setError,
    formState: { errors },
  } = useFormContext<BroadcasterAccountData>();

  const handleSuccess = useCallback(
    (fileName: string, file: File): void => {
      setValue('accountImageFile', file);
      setValue('accountImageName', fileName);
      clearErrors(['accountImageFile', 'accountImageName']);
    },
    [clearErrors, setValue],
  );

  const handleError = useCallback(
    (errorType?: ImageInputErrorTypes): void => {
      switch (errorType) {
        case 'over-size': {
          setError('accountImageFile', {
            type: 'validate',
            message: '10MB 이하의 이미지를 업로드해주세요.',
          });
          break;
        }
        case 'invalid-format': {
          setError('accountImageFile', {
            type: 'error',
            message: '파일의 형식이 올바르지 않습니다.',
          });
          break;
        }
        default: {
          // only chrome
          setValue('accountImageFile', null);
          setValue('accountImageName', '');
          clearErrors(['accountImageFile', 'accountImageName']);
        }
      }
    },
    [clearErrors, setError, setValue],
  );
  return (
    <VStack alignItems="stretch">
      <SectionHeading>정산계좌정보</SectionHeading>
      <Grid templateColumns="1fr 3fr" borderTopColor="gray.100" borderTopWidth={1.5}>
        <GridRowLayout
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
        <GridRowLayout
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
        <GridRowLayout
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
        <GridRowLayout
          header="통장사본 이미지 업로드"
          body={
            <FormControl isInvalid={!!errors.accountImageFile}>
              <ImageInput
                size="sm"
                handleSuccess={handleSuccess}
                handleError={handleError}
              />
              <FormErrorMessage ml={3} mt={0}>
                {errors.accountImageFile && errors.accountImageFile.message}
              </FormErrorMessage>
            </FormControl>
          }
        />
      </Grid>
    </VStack>
  );
}

export default BroadcasterSettlementInfoAccount;
