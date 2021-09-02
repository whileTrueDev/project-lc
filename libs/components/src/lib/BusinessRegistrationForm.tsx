import {
  Grid,
  GridItem,
  Input,
  Flex,
  FormControl,
  FormErrorMessage,
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
import { FileInput } from './FileInput';
import { BusinessRegistrationFormDto } from './BusinessRegistrationDialog';

const headerConfig = {
  colSpan: [2, 1, 1, 1],
  p: 3,
  pb: 5,
  pt: 2,
  fontSize: 13,
  backgroundColor: 'gray.50',
  borderBottomColor: 'gray.100',
  borderBottomWidth: 1.5,
  borderRightColor: 'gray.100',
  borderRightWidth: 1.5,
};

const valueConfig = {
  colSpan: [2, 1, 1, 1],
  p: 3,
  borderBottomColor: 'gray.100',
  borderBottomWidth: 1.5,
  fontSize: 14,
  mb: [3, 0, 0, 0],
};

export interface BusinessRegistrationFormProps {
  inputRef: MutableRefObject<null>;
  register: UseFormRegister<BusinessRegistrationFormDto>;
  errors: DeepMap<BusinessRegistrationFormDto, FieldError>;
  seterror: UseFormSetError<BusinessRegistrationFormDto>;
  setvalue: UseFormSetValue<BusinessRegistrationFormDto>;
  clearErrors: UseFormClearErrors<BusinessRegistrationFormDto>;
}

function BusinessRegistrationFormTag(props: BusinessRegistrationFormProps) {
  // 명시적 타입만 props로 전달 가능
  const { inputRef, register, errors, seterror, setvalue, clearErrors } = props;

  return (
    <Grid templateColumns="2fr 3fr" borderTopColor="gray.100" borderTopWidth={1.5}>
      <GridItem {...headerConfig}>회사명</GridItem>
      <GridItem {...valueConfig}>
        <Input
          id="companyName"
          m={3}
          variant="flushed"
          borderBottomColor="blackAlpha.500"
          placeholder="회사명을 입력해주세요."
          autoComplete="off"
          isRequired
          maxW={200}
          maxLength={25}
          {...register('companyName', {
            required: '회사명을 입력해주세요.',
          })}
          ref={inputRef}
        />
      </GridItem>
      <GridItem {...headerConfig}>사업자등록번호</GridItem>
      <GridItem {...valueConfig}>
        <FormControl isInvalid={!!errors.businessRegistrationNumber}>
          <Input
            id="businessRegistrationNumber"
            m={3}
            variant="flushed"
            maxW={300}
            maxLength={10}
            autoComplete="off"
            isRequired
            placeholder="사업자 등록 번호를 입력해주세요('-' 제외)"
            {...register('businessRegistrationNumber', {
              required: "'-'을 제외하고 숫자만 입력하세요.",
              pattern: {
                value: /^[0-9]{10}$/,
                message: '사업자 등록 번호는 10자리의 숫자입니다.',
              },
            })}
            borderBottomColor="blackAlpha.500"
          />
          <FormErrorMessage ml={3} mt={0}>
            {errors.businessRegistrationNumber &&
              errors.businessRegistrationNumber.message}
          </FormErrorMessage>
        </FormControl>
      </GridItem>
      <GridItem {...headerConfig}>대표자명</GridItem>
      <GridItem {...valueConfig}>
        <Input
          id="representativeName"
          m={3}
          variant="flushed"
          borderBottomColor="blackAlpha.500"
          placeholder="대표자명을 입력해주세요."
          isRequired
          autoComplete="off"
          maxW={200}
          maxLength={10}
          {...register('representativeName', {
            required: '대표자명을 입력해주세요.',
          })}
        />
      </GridItem>
      <GridItem {...headerConfig}>업태/종목</GridItem>
      <GridItem {...valueConfig}>
        <Flex direction="row">
          <Input
            id="businessType"
            m={3}
            variant="flushed"
            borderBottomColor="blackAlpha.500"
            placeholder="업태"
            autoComplete="off"
            isRequired
            maxLength={10}
            {...register('businessType', {
              required: '업태를 입력해주세요.',
            })}
          />
          <Input
            id="businessItem"
            m={3}
            variant="flushed"
            borderBottomColor="blackAlpha.500"
            placeholder="종목"
            isRequired
            autoComplete="off"
            maxLength={10}
            {...register('businessItem', {
              required: '종목을 입력해주세요.',
            })}
          />
        </Flex>
      </GridItem>
      <GridItem {...headerConfig}>사업장 주소</GridItem>
      <GridItem {...valueConfig}>
        <Input
          id="businessAddress"
          m={3}
          variant="flushed"
          borderBottomColor="blackAlpha.500"
          placeholder="사업장의 주소를 입력해주세요."
          isRequired
          autoComplete="off"
          maxLength={100}
          {...register('businessAddress', {
            required: '사업장의 주소를 입력해주세요.',
          })}
        />
      </GridItem>
      <GridItem {...headerConfig}>전자세금계산서 수신 이메일</GridItem>
      <GridItem {...valueConfig}>
        <FormControl isInvalid={!!errors.taxInvoiceMail}>
          <Input
            id="taxInvoiceMail"
            type="email"
            m={3}
            variant="flushed"
            placeholder="계산서를 받을 이메일을 입력해주세요."
            isRequired
            autoComplete="off"
            maxW={300}
            {...register('taxInvoiceMail', {
              pattern: {
                value: /^[\w]+@[\w]+\.[\w][\w]+$/,
                message: '이메일 형식이 올바르지 않습니다.',
              },
            })}
            borderBottomColor="blackAlpha.500"
          />
          <FormErrorMessage ml={3} mt={0}>
            {errors.taxInvoiceMail && errors.taxInvoiceMail.message}
          </FormErrorMessage>
        </FormControl>
      </GridItem>
      <GridItem {...headerConfig}>사업자 등록증 이미지 업로드</GridItem>
      <GridItem {...valueConfig}>
        <FormControl isInvalid={!!errors.businessRegistrationImage}>
          <FileInput seterror={seterror} setvalue={setvalue} clearErrors={clearErrors} />
          <FormErrorMessage ml={3} mt={0}>
            {errors.businessRegistrationImage && errors.businessRegistrationImage.message}
          </FormErrorMessage>
        </FormControl>
      </GridItem>
    </Grid>
  );
}

export const BusinessRegistrationForm = forwardRef((props, ref) => {
  return <BusinessRegistrationFormTag {...props} inputRef={ref} />;
});
