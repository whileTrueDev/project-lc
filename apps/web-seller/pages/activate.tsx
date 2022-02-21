import {
  Box,
  VStack,
  Button,
  Text,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import { CenterBox } from '@project-lc/components-layout/CenterBox';
import { SellerNavbar } from '@project-lc/components-shared/Navbar';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import {
  useMailVerificationMutation,
  useCountdown,
  useMailCodeValidationMutation,
  useRestoreInactiveDataMutation,
} from '@project-lc/hooks';
import { useForm } from 'react-hook-form';
import { emailCodeRegisterOptions } from '@project-lc/shared-types';
import { inactiveEmailStore } from '@project-lc/stores';

export function Activate(): JSX.Element {
  const router = useRouter();
  const mailVerification = useMailVerificationMutation();
  const codeValidation = useMailCodeValidationMutation();
  const restoreMutation = useRestoreInactiveDataMutation();
  const { clearTimer, startCountdown, seconds } = useCountdown();

  const toast = useToast();

  const [isNotInitial, setIsNotInitial] = useState(false);
  const [showInputBox, setShowInputBox] = useState(false);
  const [tempVerifyButtonDisable, setTempVerifyButtonDisable] = useState(false);
  const { email } = inactiveEmailStore();
  const disableVerifyButton = useCallback(() => {
    setTempVerifyButtonDisable(true);
    setTimeout(() => {
      setTempVerifyButtonDisable(false);
    }, 15 * 1000);
  }, []);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm();

  const onSubmit = useCallback(async () => {
    if (router.query?.type === 'social') {
      await restoreMutation
        .mutateAsync(String(router.query.email))
        .then(() => {
          toast({
            title: '계정이 활성화 되었습니다. 다시 로그인을 해주세요',
            status: 'success',
          });
          router.push('/login');
        })
        .catch(() => {
          toast({
            title: '활성화 오류',
            description: '계정 활성화 중 오류가 발생했습니다. 잠시 후 다시 시도 해주세요',
            status: 'error',
          });
          throw new Error('활성화 오류');
        });
    } else {
      await codeValidation
        .mutateAsync({
          email,
          code: getValues('code'),
        })
        .catch(() => {
          toast({
            title: '인증 코드 불일치',
            description: '인증 코드가 일치하지 않습니다. 다시 확인 해주세요',
            status: 'error',
          });
          throw new Error('인증 코드 불일치');
        });

      await restoreMutation
        .mutateAsync(email)
        .then(() => {
          toast({
            title: '계정이 활성화 되었습니다. 다시 로그인을 해주세요',
            status: 'success',
          });
          router.push('/login');
        })
        .catch(() => {
          toast({
            title: '활성화 오류',
            description: '계정 활성화 중 오류가 발생했습니다. 잠시 후 다시 시도 해주세요',
            status: 'error',
          });
          throw new Error('활성화 오류');
        });
    }
  }, [email, router, codeValidation, getValues, restoreMutation, toast]);

  const startMailVerification = useCallback(
    async (userMail: string) => {
      return mailVerification
        .mutateAsync({ email: userMail, isNotInitial })
        .then(() => {
          toast({
            title: `인증 코드가 ${userMail}(으)로 전송되었습니다`,
            status: 'success',
          });
          clearTimer();
          startCountdown(599);
        })
        .catch(() => {
          toast({
            title: '회원가입 오류 알림',
            description:
              '이메일 확인을 위한 인증번호를 보내는 중, 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
            status: 'error',
          });
          throw new Error('이메일 확인 전송 실패');
        });
    },
    [mailVerification, toast, isNotInitial, clearTimer, startCountdown],
  );

  return (
    <Box>
      <SellerNavbar />
      <CenterBox enableShadow header={{ title: '휴면해제', desc: '' }}>
        <VStack as="form" onSubmit={handleSubmit(onSubmit)}>
          <Text>휴면 해제 ID : {email || router.query?.email}</Text>
          <Text>휴면 해제를 하시려면, 아래 버튼을 눌러서 본인인증을 완료 해주세요.</Text>
          {!router.query?.type && (
            <Button
              onClick={() =>
                startMailVerification(email).then(() => {
                  setIsNotInitial(true);
                  setShowInputBox(true);
                })
              }
              colorScheme="blue"
            >
              메일 인증하기
            </Button>
          )}
          {showInputBox && (
            <FormControl isInvalid={!!errors.code}>
              <FormLabel htmlFor="code">
                이메일 인증 코드
                <Text fontSize="sm" color="gray.500">
                  {`${email}로 인증코드가 전송되었습니다!`}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  인증코드는 6자의 무작위 글자로 이루어져 있습니다.
                </Text>
              </FormLabel>
              <Flex alignItems="center" justifyContent="space-around">
                <Input
                  autoComplete="off"
                  id="code"
                  type="code"
                  placeholder="이메일 인증코드"
                  maxWidth="sm"
                  {...register('code', { ...emailCodeRegisterOptions })}
                />
                {seconds > 0 ? (
                  <Text as="span" color="tomato">
                    {`0${Math.floor(seconds / 60)}`}:
                    {seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60}
                  </Text>
                ) : (
                  <Text as="span" color="tomato">
                    00:00
                  </Text>
                )}
              </Flex>
              <FormErrorMessage>{errors.code && errors.code.message}</FormErrorMessage>

              <Flex alignItems="center" my={1}>
                <Text fontSize="sm" color="gray.500">
                  인증번호가 올바르게 도착하지 않았나요?
                </Text>
                <Button
                  variant="ghost"
                  size="sm"
                  isDisabled={tempVerifyButtonDisable}
                  isLoading={mailVerification.isLoading}
                  onClick={() => {
                    startMailVerification(email).then(disableVerifyButton);
                  }}
                >
                  재전송
                </Button>
              </Flex>
            </FormControl>
          )}
          {!router.query?.type && showInputBox && (
            <Button
              bg="blue.400"
              color="white"
              _hover={{ bg: 'blue.500' }}
              type="submit"
              isLoading={isSubmitting}
            >
              인증완료
            </Button>
          )}

          {router.query?.type && (
            <Button isLoading={isSubmitting} type="submit">
              휴면해제
            </Button>
          )}
        </VStack>
      </CenterBox>
    </Box>
  );
}

export default Activate;
