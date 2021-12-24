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
  useToast,
} from '@chakra-ui/react';
import { emailRegisterOptions, InquiryDto } from '@project-lc/shared-types';
import { FormProvider, useForm } from 'react-hook-form';
import { useInquiryMutation } from '@project-lc/hooks';

export type InquiryFormProps = {
  type: 'seller' | 'broadcaster';
};

export function InquiryForm(props: InquiryFormProps): JSX.Element {
  const { type } = props;
  const [isChecked, setIsChecked] = useState(false);
  const handleIsChecked = (): void => {
    setIsChecked(!isChecked);
  };
  const toast = useToast();

  const { mutateAsync, isLoading } = useInquiryMutation();

  const methods = useForm<InquiryDto>({
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      brandName: '',
      homepage: '',
      content: '',
      type,
    },
  });
  const onSuccess = (): void => {
    toast({
      title: '문의가 접수되었습니다.',
      status: 'success',
    });
    reset({
      name: '',
      email: '',
      phoneNumber: '',
      brandName: '',
      homepage: '',
      content: '',
      type,
    });
    setIsChecked(false);
  };

  const onFail = (): void => {
    toast({
      title: '문의 접수 중 오류가 발생했습니다. 잠시 후, 다시 시도해주세요',
      status: 'error',
    });
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  const regist = (inquiryInputs: InquiryDto): void => {
    mutateAsync(inquiryInputs).then(onSuccess).catch(onFail);
  };

  return (
    <Container maxW="container.lg">
      <Heading>문의사항을 남겨주세요</Heading>
      <FormProvider {...methods}>
        <Grid
          as="form"
          w="100%"
          h="100%"
          templateRows="repeat(6, 1fr)"
          templateColumns="repeat(3, 1fr)"
          gap={4}
          mt={6}
          onSubmit={handleSubmit(regist)}
        >
          <GridItem rowSpan={1} colSpan={1}>
            <FormControl>
              <FormLabel color="red.500">
                {type === 'seller' ? '이름' : '활동명'}
              </FormLabel>
              <Input
                placeholder={type === 'seller' ? '홍길동' : '홍길동tv'}
                {...register('name', {
                  required: { value: true, message: '이름을 입력해주세요.' },
                })}
              />
            </FormControl>
          </GridItem>
          <GridItem rowSpan={1} colSpan={1}>
            <FormControl isInvalid={!!errors.email}>
              <FormLabel color="red.500">이메일</FormLabel>
              <Input
                placeholder="minsu@example.com"
                autoComplete="off"
                {...register('email', {
                  ...emailRegisterOptions,
                  required: { value: true, message: '이메일을 입력해주세요.' },
                })}
              />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem rowSpan={1} colSpan={1}>
            <FormControl isInvalid={!!errors.phoneNumber}>
              <FormLabel>연락처</FormLabel>
              <Input
                placeholder={`'-' 없이 숫자만 입력해주세요`}
                {...register('phoneNumber', {
                  pattern: {
                    value: /^[0-9]+$/,
                    message: '전화번호는 숫자만 가능합니다.',
                  },
                })}
              />
              <FormErrorMessage>{errors.phoneNumber?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem rowSpan={1} colSpan={1}>
            <FormControl>
              <FormLabel>{type === 'seller' ? '브랜드명' : '방송 플랫폼명'}</FormLabel>
              <Input
                placeholder={type === 'seller' ? '크크쇼' : '아프리카, 트위치, 유튜브'}
                {...register('brandName')}
              />
            </FormControl>
          </GridItem>
          <GridItem rowSpan={1} colSpan={1}>
            <FormControl>
              <FormLabel>{type === 'seller' ? '홈페이지 URL' : '방송채널 URL'}</FormLabel>
              <Input
                placeholder={
                  type === 'seller' ? 'https://크크쇼.com' : 'https://www.youtube.com/...'
                }
                {...register('homepage')}
              />
            </FormControl>
          </GridItem>
          <GridItem rowSpan={1} colSpan={1} />
          <GridItem rowSpan={1} colSpan={3}>
            <FormControl>
              <FormLabel color="red.500">내용</FormLabel>
              <Textarea
                resize="none"
                placeholder={
                  type === 'seller'
                    ? '입점 문의드립니다.'
                    : '라이브 커머스 방송을 하고 싶어요'
                }
                isInvalid={!!errors.content}
                {...register('content', {
                  maxLength: {
                    value: 500,
                    message: '500자 이하로 작성해주세요.',
                  },
                  required: { value: true, message: '문의내용을 입력해주세요' },
                })}
              />
              <Text as="em" color="red.300">
                {errors.content?.message}
              </Text>
            </FormControl>
          </GridItem>
          <GridItem colSpan={3} alignItems="center">
            <Center h="100%">
              <Checkbox isChecked={isChecked} onChange={handleIsChecked}>
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
                type="submit"
                isDisabled={!isChecked}
                isLoading={isLoading}
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
