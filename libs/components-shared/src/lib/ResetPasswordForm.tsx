import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import {
  getEmailDupCheck,
  useCodeVerifyMutation,
  useMailVerificationMutation,
  useCountdown,
} from '@project-lc/hooks';
import { emailCodeRegisterOptions, emailRegisterOptions } from '@project-lc/shared-types';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import CenterBox from '@project-lc/components-layout/CenterBox';
import PasswordChangeForm from './PasswordChangeForm';

const resetPasswordStepHeaders = [
  {
    header: {
      title: '비밀번호를 잊어버리셨나요?',
      desc: `비밀번호를 재설정하기 위한 인증 코드를 보내드립니다. \n가입 시 사용한 이메일을 입력해주세요.`,
    },
  },
  {
    header: {
      title: '코드입력',
      desc: '인증코드는 6자의 무작위 글자로 이루어져 있습니다.',
    },
  },
  {
    header: {
      title: '비밀번호 재설정',
      desc: '새로운 비밀번호를 입력해주세요',
    },
  },
];

export function ResetPasswordForm(): JSX.Element {
  const router = useRouter();
  const toast = useToast();
  const showCodeSendErrorToast = useCallback(() => {
    toast({
      title: '인증코드 전송 실패',
      status: 'error',
    });
  }, [toast]);

  const {
    register,
    reset,
    trigger,
    getValues,
    setError,
    formState: { errors },
  } = useForm<{ email: string; code: string }>();

  const { clearTimer, startCountdown, seconds } = useCountdown();

  const [step, setStep] = useState(0);
  // 비밀번호 재발급 스텝
  // 0 : 이메일 입력
  // 1 : 인증코드 입력
  // 2 : 비밀번호 변경

  // 이메일 코드 최초전송 여부
  const [isNotInitial, setIsNotInitial] = useState(false);

  const moveToStepZero = useCallback(() => {
    setStep(0);
    reset();
    clearTimer();
  }, [clearTimer, reset]);

  const moveToStepOne = useCallback(() => {
    setStep(1);
    clearTimer();
  }, [clearTimer]);

  const moveToStepTwo = useCallback(() => {
    setStep(2);
    clearTimer();
  }, [clearTimer]);

  const { mutateAsync: sendEmailCode, isLoading: sendEmailLoading } =
    useMailVerificationMutation();
  const { mutateAsync: verifyCode, isLoading: verifyCodeLoading } =
    useCodeVerifyMutation();

  // 인증코드 전송
  const checkEmailExistAndSendCode = useCallback(async () => {
    // 이메일 형식 확인
    const isValidEmail = await trigger('email');
    if (!isValidEmail) return;

    const email = getValues('email');
    const isOk = await getEmailDupCheck(email); // 중복되지않은 경우 true, 중복된 경우 false
    if (isOk) {
      setError('email', {
        type: 'validate',
        message: '가입되지 않은 이메일입니다',
      });
      return;
    }

    // 인증코드 전송 후 StepOne(코드확인)로 이동
    sendEmailCode({ email })
      .then(() => {
        setIsNotInitial(true);
        moveToStepOne();
      })
      .catch((err) => {
        console.error(err);
        showCodeSendErrorToast();
      });
  }, [
    getValues,
    moveToStepOne,
    sendEmailCode,
    setError,
    showCodeSendErrorToast,
    trigger,
  ]);

  // 인증코드 확인 요청
  const checkCode = useCallback(async () => {
    const email = getValues('email');
    const code = getValues('code');

    // 코드 형식 확인
    const isValidCode = await trigger('code');
    if (!isValidCode) return;

    // 인증코드 확인 후 StepTwo(비밀번호 재설정)로 이동
    verifyCode({ email, code }).then((isVerified) => {
      if (isVerified) {
        moveToStepTwo(); // step 2  비밀번호 변경
      } else {
        setError('code', {
          type: 'validate',
          message: '인증코드가 틀렸습니다',
        });
      }
    });
  }, [getValues, moveToStepTwo, setError, trigger, verifyCode]);

  // 인증코드 재전송
  const reSendCode = useCallback(async () => {
    const email = getValues('email');
    sendEmailCode({ email, isNotInitial })
      .then(() => {
        toast({
          title: '인증코드 재전송 성공',
          status: 'success',
        });
        // 재전송 60초간 방지
        startCountdown(60);
      })
      .catch((err) => {
        console.error(err);
        showCodeSendErrorToast();
      });
  }, [
    getValues,
    sendEmailCode,
    showCodeSendErrorToast,
    startCountdown,
    toast,
    isNotInitial,
  ]);

  return (
    <CenterBox enableShadow header={resetPasswordStepHeaders[step].header}>
      <Box as="form">
        {/* step 0 : 이메일 확인  */}
        {step === 0 && (
          <Stack pt={6} spacing={6}>
            <FormControl isInvalid={!!errors.email}>
              <FormLabel htmlFor="email">이메일</FormLabel>
              <Input
                id="email"
                type="email"
                placeholder="minsu@example.com"
                autoComplete="off"
                autoFocus
                {...register('email', { ...emailRegisterOptions })}
              />
              <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
            </FormControl>
            <ButtonGroup spacing={2}>
              <Button isFullWidth onClick={() => router.push('/login')} mr={2}>
                이전
              </Button>
              <Button
                isFullWidth
                onClick={checkEmailExistAndSendCode}
                isLoading={sendEmailLoading}
              >
                다음
              </Button>
            </ButtonGroup>
          </Stack>
        )}
        {/* step 1 : 코드 확인  */}
        {step === 1 && (
          <Stack pt={6} spacing={6}>
            <Text>{getValues('email')}로 발송된 코드를 확인해주세요.</Text>

            <FormControl isInvalid={!!errors.code}>
              <Input
                id="code"
                placeholder="이메일 인증코드"
                autoComplete="off"
                autoFocus
                {...register('code', { ...emailCodeRegisterOptions })}
              />
              <FormErrorMessage>{errors.code && errors.code.message}</FormErrorMessage>
            </FormControl>
            <ButtonGroup spacing={2}>
              <Button isFullWidth onClick={moveToStepZero}>
                이전
              </Button>
              <Button isFullWidth onClick={checkCode} isLoading={verifyCodeLoading}>
                다음
              </Button>
            </ButtonGroup>

            <Box fontSize="sm">
              <Text as="span" mr={2}>
                인증코드를 받지 못하셨나요?
              </Text>

              {seconds > 0 ? (
                <Text as="span">{seconds}초 후 재전송 가능합니다</Text>
              ) : (
                <Button variant="link" onClick={reSendCode} isLoading={sendEmailLoading}>
                  재전송
                </Button>
              )}
            </Box>
          </Stack>
        )}
      </Box>

      {/* step 2 : 비밀번호 재설정 */}
      {step === 2 && (
        <PasswordChangeForm
          email={getValues('email')}
          onCancel={moveToStepZero}
          onConfirm={() => router.push('/login')}
        />
      )}
    </CenterBox>
  );
}

export default ResetPasswordForm;
