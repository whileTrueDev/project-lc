import {
  Grid,
  GridItem,
  Input,
  Flex,
  FormControl,
  FormErrorMessage,
  useColorModeValue,
} from '@chakra-ui/react';
import { forwardRef, MutableRefObject } from 'react';
import {
  UseFormRegister,
  FieldError,
  DeepMap,
  UseFormSetError,
  UseFormSetValue,
  UseFormClearErrors,
} from 'react-hook-form';
import { ImageInput, ImageInputErrorTypes } from './ImageInput';
import { BusinessRegistrationFormDto } from './BusinessRegistrationDialog';
import { useDialogHeaderConfig, useDialogValueConfig } from './GridTableItem';
import { BusinessRegistrationMailOrderNumerSection } from './BusinessRegistrationMailOrderNumerSection';

export interface BusinessRegistrationFormProps {
  inputRef: MutableRefObject<null>;
  register: UseFormRegister<BusinessRegistrationFormDto>;
  errors: DeepMap<BusinessRegistrationFormDto, FieldError>;
  seterror: UseFormSetError<BusinessRegistrationFormDto>;
  setvalue: UseFormSetValue<BusinessRegistrationFormDto>;
  clearErrors: UseFormClearErrors<BusinessRegistrationFormDto>;
}

function BusinessRegistrationFormTag(props: BusinessRegistrationFormProps): JSX.Element {
  // 명시적 타입만 props로 전달 가능
  const { inputRef, register, errors, seterror, setvalue, clearErrors } = props;

  function handleSuccess(fileName: string, file: File): void {
    setvalue('businessRegistrationImage', file);
    setvalue('businessRegistrationImageName', fileName);
    clearErrors(['businessRegistrationImage', 'businessRegistrationImageName']);
  }

  function handleError(errorType?: ImageInputErrorTypes): void {
    switch (errorType) {
      case 'over-size': {
        seterror('businessRegistrationImage', {
          type: 'validate',
          message: '10MB 이하의 이미지를 업로드해주세요.',
        });
        break;
      }
      case 'invalid-format': {
        seterror('businessRegistrationImage', {
          type: 'error',
          message: '파일의 형식이 올바르지 않습니다.',
        });
        break;
      }
      default: {
        // only chrome
        setvalue('businessRegistrationImage', null);
        setvalue('businessRegistrationImageName', null);
        clearErrors(['businessRegistrationImage', 'businessRegistrationImageName']);
      }
    }
  }

  return (
    <Grid templateColumns="2fr 3fr" borderTopColor="gray.100" borderTopWidth={1.5}>
      <GridItem {...useDialogHeaderConfig(useColorModeValue)}>회사명*</GridItem>
      <GridItem {...useDialogValueConfig(useColorModeValue)}>
        <FormControl isInvalid={!!errors.companyName}>
          <Input
            id="companyName"
            m={[1, 3, 3, 3]}
            variant="flushed"
            placeholder="회사명을 입력해주세요."
            autoComplete="off"
            maxW={200}
            maxLength={25}
            {...register('companyName', {
              required: '회사명을 입력해주세요.',
            })}
            ref={inputRef}
          />
          <FormErrorMessage ml={3} mt={0}>
            {errors.companyName && errors.companyName.message}
          </FormErrorMessage>
        </FormControl>
      </GridItem>
      <GridItem {...useDialogHeaderConfig(useColorModeValue)}>사업자등록번호*</GridItem>
      <GridItem {...useDialogValueConfig(useColorModeValue)}>
        <FormControl isInvalid={!!errors.businessRegistrationNumber}>
          <Input
            id="businessRegistrationNumber"
            m={[1, 3, 3, 3]}
            variant="flushed"
            maxW={['inherit', 300, 300, 300]}
            maxLength={10}
            autoComplete="off"
            placeholder="사업자 등록 번호를 입력해주세요('-' 제외)"
            {...register('businessRegistrationNumber', {
              required: "'-'을 제외하고 숫자만 입력하세요.",
              pattern: {
                value: /^[0-9]{10}$/,
                message: '사업자 등록 번호는 10자리의 숫자입니다.',
              },
            })}
          />
          <FormErrorMessage ml={3} mt={0}>
            {errors.businessRegistrationNumber &&
              errors.businessRegistrationNumber.message}
          </FormErrorMessage>
        </FormControl>
      </GridItem>
      <GridItem {...useDialogHeaderConfig(useColorModeValue)}>
        사업자 등록증 이미지 업로드*
      </GridItem>
      <GridItem {...useDialogValueConfig(useColorModeValue)}>
        <FormControl isInvalid={!!errors.businessRegistrationImage}>
          <ImageInput handleSuccess={handleSuccess} handleError={handleError} />
          <FormErrorMessage ml={3} mt={0}>
            {errors.businessRegistrationImage && errors.businessRegistrationImage.message}
          </FormErrorMessage>
        </FormControl>
      </GridItem>
      <GridItem {...useDialogHeaderConfig(useColorModeValue)}>대표자명*</GridItem>
      <GridItem {...useDialogValueConfig(useColorModeValue)}>
        <FormControl isInvalid={!!errors.representativeName}>
          <Input
            id="representativeName"
            m={[1, 3, 3, 3]}
            variant="flushed"
            placeholder="대표자명을 입력해주세요."
            autoComplete="off"
            maxW={200}
            maxLength={10}
            {...register('representativeName', {
              required: '대표자명을 입력해주세요.',
            })}
          />
          <FormErrorMessage ml={3} mt={0}>
            {errors.representativeName && errors.representativeName.message}
          </FormErrorMessage>
        </FormControl>
      </GridItem>
      <GridItem {...useDialogHeaderConfig(useColorModeValue)}>업태/종목*</GridItem>
      <GridItem {...useDialogValueConfig(useColorModeValue)}>
        <Flex direction="row">
          <FormControl isInvalid={!!errors.businessType} mr={1}>
            <Input
              id="businessType"
              m={[1, 3, 3, 3]}
              variant="flushed"
              placeholder="업태"
              autoComplete="off"
              maxLength={50}
              {...register('businessType', {
                required: '업태를 입력해주세요.',
              })}
            />
            <FormErrorMessage ml={3} mt={0}>
              {errors.businessType && errors.businessType.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.businessItem}>
            <Input
              id="businessItem"
              m={[1, 3, 3, 3]}
              variant="flushed"
              placeholder="종목"
              autoComplete="off"
              maxLength={50}
              {...register('businessItem', {
                required: '종목을 입력해주세요.',
              })}
            />
            <FormErrorMessage ml={3} mt={0}>
              {errors.businessItem && errors.businessItem.message}
            </FormErrorMessage>
          </FormControl>
        </Flex>
      </GridItem>
      <GridItem {...useDialogHeaderConfig(useColorModeValue)}>사업장 주소*</GridItem>
      <GridItem {...useDialogValueConfig(useColorModeValue)}>
        <FormControl isInvalid={!!errors.businessAddress}>
          <Input
            id="businessAddress"
            m={[1, 3, 3, 3]}
            variant="flushed"
            placeholder="사업장의 주소를 입력해주세요."
            autoComplete="off"
            maxLength={100}
            {...register('businessAddress', {
              required: '사업장의 주소를 입력해주세요.',
            })}
          />
          <FormErrorMessage ml={3} mt={0}>
            {errors.businessAddress && errors.businessAddress.message}
          </FormErrorMessage>
        </FormControl>
      </GridItem>
      <GridItem {...useDialogHeaderConfig(useColorModeValue)}>
        전자세금계산서 수신 이메일*
      </GridItem>
      <GridItem {...useDialogValueConfig(useColorModeValue)}>
        <FormControl isInvalid={!!errors.taxInvoiceMail}>
          <Input
            id="taxInvoiceMail"
            m={[1, 3, 3, 3]}
            variant="flushed"
            placeholder="계산서를 받을 이메일을 입력해주세요."
            autoComplete="off"
            maxW={['inherit', 300, 300, 300]}
            {...register('taxInvoiceMail', {
              required: '전자계산서 발급을 위한 이메일을 입력해주세요.',
              pattern: {
                value: /^[\w]+@[\w]+\.[\w][\w]+$/,
                message: '이메일 형식이 올바르지 않습니다.',
              },
            })}
          />
          <FormErrorMessage ml={3} mt={0}>
            {errors.taxInvoiceMail && errors.taxInvoiceMail.message}
          </FormErrorMessage>
        </FormControl>
      </GridItem>
      <BusinessRegistrationMailOrderNumerSection {...props} />
    </Grid>
  );
}

export const BusinessRegistrationForm = forwardRef(
  (props: Omit<BusinessRegistrationFormProps, 'inputRef'>, ref: any) => {
    return <BusinessRegistrationFormTag {...props} inputRef={ref} />;
  },
);
