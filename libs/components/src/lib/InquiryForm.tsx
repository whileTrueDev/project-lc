import { useState } from 'react';
import {
  Container,
  Heading,
  Text,
  Input,
  Grid,
  GridItem,
  Textarea,
  FormControl,
  FormLabel,
  Checkbox,
  Button,
  FormErrorMessage,
  Center,
} from '@chakra-ui/react';
import { emailRegisterOptions, InquiryInput } from '@project-lc/shared-types';
import { FormProvider, useForm } from 'react-hook-form';

export function InquiryForm(): JSX.Element {
  const [isChecked, setIsChecked] = useState(false);
  const handleIsChecked = (): void => {
    setIsChecked(!isChecked);
  };
  const methods = useForm<InquiryInput>({
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      brandName: '',
      homepage: '',
      content: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const regist = (inquiryInputs: InquiryInput): void => {
    console.log(inquiryInputs);
  };

  return (
    <Container maxW="container.lg">
      <Heading>문의사항을 남겨주세요</Heading>
      <Text>* 표시는 필수 입력 사항입니다.</Text>
      <FormProvider {...methods}>
        <Grid
          as="form"
          w="100%"
          h="100%"
          templateRows="repeat(6, 1fr)"
          templateColumns="repeat(3, 1fr)"
          gap={4}
          // onSubmit={regist}
        >
          <GridItem rowSpan={1} colSpan={1}>
            <FormControl isRequired>
              <FormLabel>이름</FormLabel>
              <Input {...register('name')} />
            </FormControl>
          </GridItem>
          <GridItem rowSpan={1} colSpan={1}>
            <FormControl isInvalid={!!errors.email} isRequired>
              <FormLabel>이메일</FormLabel>
              <Input
                placeholder="minsu@example.com"
                autoComplete="off"
                {...register('email', { ...emailRegisterOptions })}
              />
              <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem rowSpan={1} colSpan={1}>
            <FormControl isInvalid={!!errors.phoneNumber}>
              <FormLabel>연락처</FormLabel>
              <Input
                placeholder={`'-' 없이 숫자만 입력해주세요`}
                {...register('phoneNumber', {
                  required: '숫자만 입력하세요.',
                  pattern: {
                    value: /^[0-9]+$/,
                    message: '전화번호는 숫자만 가능합니다.',
                  },
                })}
              />
              <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem rowSpan={1} colSpan={1}>
            <FormControl>
              <FormLabel>브랜드명</FormLabel>
              <Input {...register('brandName')} />
            </FormControl>
          </GridItem>
          <GridItem rowSpan={1} colSpan={1}>
            <FormControl>
              <FormLabel>홈페이지</FormLabel>
              <Input {...register('homepage')} />
            </FormControl>
          </GridItem>
          <GridItem rowSpan={1} colSpan={1} />
          <GridItem rowSpan={1} colSpan={3}>
            <FormControl isRequired>
              <FormLabel>내용</FormLabel>
              <Textarea
                resize="none"
                isInvalid={!!errors.content}
                {...register('content', {
                  maxLength: {
                    value: 500,
                    message: '500자 이하로 작성해주세요.',
                  },
                })}
              />
            </FormControl>
          </GridItem>
          <GridItem colSpan={3} alignItems="center">
            <Center h="100%">
              <Checkbox onChange={handleIsChecked}>
                개인정보 수집 및 이용안내에 동의합니다
              </Checkbox>
            </Center>
          </GridItem>
          <GridItem colSpan={3}>
            <Center>
              <Button
                bg="pink.400"
                _hover={{
                  bg: 'pink.300',
                }}
                // type="submit"
                isDisabled={!isChecked}
                onClick={() => {
                  regist();
                }}
              >
                문의하기
              </Button>
            </Center>
          </GridItem>
        </Grid>
      </FormProvider>
    </Container>
  );
}

export default InquiryForm;
