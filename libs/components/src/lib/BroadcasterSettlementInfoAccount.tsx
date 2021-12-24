import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Grid,
  Input,
  Select,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { banks } from '@project-lc/shared-types';
import { useCallback } from 'react';
import { SectionHeading } from './BroadcasterSettlementInfoDialog';
import { ImageInput, ImageInputErrorTypes } from './ImageInput';
import { GridTableItem } from './GridTableItem';
import BroadcasterImageUploadGuideDialog from './BroadcasterImageUploadGuideDialog';

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
  const { isOpen, onOpen, onClose } = useDisclosure();
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
      <Grid templateColumns="1fr 3fr" borderTopColor="gray.500" borderTopWidth={1.5}>
        <GridTableItem
          title="은행"
          value={
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
        <GridTableItem
          title="계좌번호"
          value={
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
        <GridTableItem
          title="예금주명"
          value={
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
        <GridTableItem
          title="통장사본 이미지 업로드"
          value={
            <Flex alignItems="center">
              <FormControl isInvalid={!!errors.accountImageFile} maxW="60%">
                <ImageInput
                  size="sm"
                  handleSuccess={handleSuccess}
                  handleError={handleError}
                />
                <FormErrorMessage ml={3} mt={0}>
                  {errors.accountImageFile && errors.accountImageFile.message}
                </FormErrorMessage>
              </FormControl>
              <Button size="xs" onClick={onOpen}>
                통장사본 업로드 안내
              </Button>
            </Flex>
          }
        />
      </Grid>
      <BroadcasterImageUploadGuideDialog
        isOpen={isOpen}
        onClose={onClose}
        type="account"
      />
    </VStack>
  );
}

export default BroadcasterSettlementInfoAccount;
