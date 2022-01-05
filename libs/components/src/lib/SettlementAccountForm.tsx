import {
  FormControl,
  FormErrorMessage,
  Grid,
  GridItem,
  Input,
  Select,
  useColorModeValue,
} from '@chakra-ui/react';
import { ImageInput, ImageInputErrorTypes } from '@project-lc/components-core/ImageInput';
import {
  useDialogHeaderConfig,
  useDialogValueConfig,
} from '@project-lc/components-layout/GridTableItem';
import { banks } from '@project-lc/shared-types';
import { useFormContext } from 'react-hook-form';
import { SettlementAccountFormDto } from './SettlementAccountDialog';

export function SettlementAccountForm(): JSX.Element {
  // 명시적 타입만 props로 전달 가능
  const {
    register,
    formState: { errors },
    setError,
    setValue,
    clearErrors,
  } = useFormContext<SettlementAccountFormDto>();

  // 통장사본 제출
  function handleSuccess(fileName: string, file: File): void {
    setValue('settlementAccountImage', file);
    setValue('settlementAccountImageName', fileName);
    clearErrors(['settlementAccountImage', 'settlementAccountImageName']);
  }

  function handleError(errorType?: ImageInputErrorTypes): void {
    switch (errorType) {
      case 'over-size': {
        setError('settlementAccountImage', {
          type: 'validate',
          message: '10MB 이하의 이미지를 업로드해주세요.',
        });
        break;
      }
      case 'invalid-format': {
        setError('settlementAccountImage', {
          type: 'error',
          message: '파일의 형식이 올바르지 않습니다.',
        });
        break;
      }
      default: {
        // only chrome
        setValue('settlementAccountImage', null);
        setValue('settlementAccountImageName', '');
        clearErrors(['settlementAccountImage', 'settlementAccountImageName']);
      }
    }
  }

  return (
    <Grid templateColumns="2fr 3fr" borderTopColor="gray.100" borderTopWidth={1.5}>
      <GridItem {...useDialogHeaderConfig(useColorModeValue)}>은행</GridItem>
      <GridItem {...useDialogValueConfig(useColorModeValue)}>
        <Select
          id="bank"
          m={[1, 3, 3, 3]}
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
      </GridItem>
      <GridItem {...useDialogHeaderConfig(useColorModeValue)}>계좌번호</GridItem>
      <GridItem {...useDialogValueConfig(useColorModeValue)}>
        <FormControl isInvalid={!!errors.number}>
          <Input
            id="number"
            m={[1, 3, 3, 3]}
            variant="flushed"
            maxW={['inherit', 300, 300, 300]}
            autoComplete="off"
            placeholder="계좌번호를 입력해주세요('-' 제외)"
            {...register('number', {
              required: "'-'을 제외하고 숫자만 입력하세요.",
              pattern: {
                value: /^[0-9]+$/,
                message: '계좌번호는 숫자만 가능합니다.',
              },
            })}
          />
          <FormErrorMessage ml={3} mt={0}>
            {errors.number && errors.number.message}
          </FormErrorMessage>
        </FormControl>
      </GridItem>
      <GridItem {...useDialogHeaderConfig(useColorModeValue)}>예금주명</GridItem>
      <GridItem {...useDialogValueConfig(useColorModeValue)}>
        <FormControl isInvalid={!!errors.name}>
          <Input
            id="name"
            m={[1, 3, 3, 3]}
            variant="flushed"
            placeholder="예금주명을 입력하세요."
            autoComplete="off"
            maxW={200}
            {...register('name', {
              required: '예금주명 입력이 필요합니다.',
            })}
          />
          <FormErrorMessage ml={3} mt={0}>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>
      </GridItem>
      <GridItem {...useDialogHeaderConfig(useColorModeValue)}>
        통장사본 이미지 업로드
      </GridItem>
      <GridItem {...useDialogValueConfig(useColorModeValue)}>
        <FormControl isInvalid={!!errors.settlementAccountImage}>
          <ImageInput handleSuccess={handleSuccess} handleError={handleError} />
          <FormErrorMessage ml={3} mt={0}>
            {errors.settlementAccountImage && errors.settlementAccountImage.message}
          </FormErrorMessage>
        </FormControl>
      </GridItem>
    </Grid>
  );
}

export default SettlementAccountForm;
