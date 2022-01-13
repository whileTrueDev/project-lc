import {
  Button,
  Center,
  Checkbox,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { InquiryType } from '@prisma/client';
import { useInquiryMutation } from '@project-lc/hooks';
import { emailRegisterOptions, InquiryDto } from '@project-lc/shared-types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface InquiryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: InquiryType;
}
export function InquiryDialog({
  isOpen,
  onClose,
  type,
}: InquiryDialogProps): JSX.Element {
  return (
    <Modal
      size="2xl"
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading as="h3" fontSize={['xl', '3xl']}>
            문의사항을 남겨주세요
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={8}>
          <InquiryForm type={type} onSuccess={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export type InquiryFormProps = {
  type: InquiryType;
  onSuccess?: () => void;
};

export function InquiryForm({ type, onSuccess }: InquiryFormProps): JSX.Element {
  const toast = useToast();
  const [isChecked, setIsChecked] = useState(false);
  const handleIsChecked = (): void => {
    setIsChecked(!isChecked);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InquiryDto>();

  const { mutateAsync, isLoading } = useInquiryMutation();

  const onSuccessDefault = (): void => {
    toast({ title: '문의가 접수되었습니다.', status: 'success' });
    reset();
    setIsChecked(false);
  };
  const onFail = (): void => {
    const failText = '문의 접수 중 오류가 발생했습니다. 잠시 후, 다시 시도해주세요';
    toast({ title: failText, status: 'error' });
  };
  const onSubmit = (inquiryInputs: InquiryDto): void => {
    mutateAsync({ ...inquiryInputs, type })
      .then(() => {
        onSuccessDefault();
        if (onSuccess) onSuccess();
      })
      .catch(onFail);
  };

  return (
    <Container maxW="container.lg">
      <Grid
        as="form"
        w="100%"
        h="100%"
        templateColumns="repeat(4, 1fr)"
        gap={4}
        rowGap={8}
        mt={6}
        onSubmit={handleSubmit(onSubmit)}
      >
        <GridItem colSpan={[4, 2]}>
          <FormControl isInvalid={!!errors.name}>
            <FormLabel color="red.500">{type === 'seller' ? '이름' : '활동명'}</FormLabel>
            <Input
              placeholder={type === 'seller' ? '홍길동' : '홍길동tv'}
              {...register('name', { required: '이름을 입력해주세요.' })}
            />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[4, 2]}>
          <FormControl isInvalid={!!errors.email}>
            <FormLabel color="red.500">이메일</FormLabel>
            <Input
              placeholder="gildong@example.com"
              autoComplete="off"
              {...register('email', {
                ...emailRegisterOptions,
                required: '이메일을 입력해주세요.',
              })}
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[4, 2]} display={{ base: 'none', sm: 'block' }}>
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

        <GridItem colSpan={[4, 2]} display={{ base: 'none', sm: 'block' }}>
          <FormControl isInvalid={!!errors.brandName}>
            <FormLabel>{type === 'seller' ? '브랜드명' : '방송 플랫폼명'}</FormLabel>
            <Input
              placeholder={type === 'seller' ? '크크쇼' : '아프리카, 트위치, 유튜브'}
              {...register('brandName')}
            />
            <FormErrorMessage>{errors.brandName?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[4, 2]} display={{ base: 'none', sm: 'block' }}>
          <FormControl isInvalid={!!errors.homepage}>
            <FormLabel>{type === 'seller' ? '홈페이지 URL' : '방송채널 URL'}</FormLabel>
            <Input
              placeholder={
                type === 'seller' ? 'https://크크쇼.com' : 'https://www.youtube.com/...'
              }
              {...register('homepage')}
            />
          </FormControl>
          <FormErrorMessage>{errors.homepage?.message}</FormErrorMessage>
        </GridItem>

        <GridItem colSpan={4}>
          <FormControl isInvalid={!!errors.content}>
            <FormLabel color="red.500">내용</FormLabel>
            <Textarea
              resize="none"
              placeholder={
                type === 'seller'
                  ? '입점 문의드립니다.'
                  : '라이브 커머스 방송을 하고 싶어요'
              }
              {...register('content', {
                maxLength: {
                  value: 500,
                  message: '500자 이하로 작성해주세요.',
                },
                required: '문의내용을 입력해주세요',
              })}
            />
            <FormErrorMessage>{errors.content?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={4} alignItems="center">
          <Center h="100%">
            <Checkbox isChecked={isChecked} onChange={handleIsChecked} colorScheme="pink">
              개인정보 수집에 동의합니다.
            </Checkbox>
          </Center>
        </GridItem>
        <GridItem colSpan={4}>
          <Center>
            <Button
              colorScheme="pink"
              type="submit"
              isDisabled={!isChecked}
              isLoading={isLoading}
            >
              문의하기
            </Button>
          </Center>
        </GridItem>
      </Grid>
    </Container>
  );
}

export default InquiryForm;
