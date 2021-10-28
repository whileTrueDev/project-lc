import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import {
  getEmailDupCheck,
  useMailVerificationMutation,
  useSellerSignupMutation,
  useLoginMutation,
} from '@project-lc/hooks';
import {
  emailCodeRegisterOptions,
  emailRegisterOptions,
  passwordRegisterOptions,
  SignUpSellerDto,
} from '@project-lc/shared-types';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CenterBox } from './CenterBox';

export interface SignupFormProps {
  enableShadow?: boolean;
  moveToSignupStart?: () => void;
}
export function SignupForm({
  enableShadow = false,
  moveToSignupStart,
}: SignupFormProps): JSX.Element {
  const router = useRouter();
  const toast = useToast();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    trigger,
    getValues,
    setError,
    watch,
  } = useForm<SignUpSellerDto & { repassword: string }>();

  // * 인증코드 페이즈
  const [phase, setPhase] = useState(1);

  // * 인증 코드 이메일 전송
  const mailVerification = useMailVerificationMutation();
  const startMailVerification = useCallback(
    async (email: string) => {
      return mailVerification
        .mutateAsync({ email })
        .then(() =>
          toast({
            title: `인증 코드가 ${email}(으)로 전송되었습니다`,
            status: 'success',
          }),
        )
        .catch((err) => {
          toast({
            title: '회원가입 오류 알림',
            description:
              '이메일 확인을 위한 인증번호를 보내는 중, 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
            status: 'error',
          });
        });
    },
    [mailVerification, toast],
  );

  // * 인증코드 메일 보내기 mutation 요청
  const checkValidation = useCallback(async () => {
    const isValid = await trigger();
    if (isValid) {
      const email = getValues('email');
      // * 중복 확인
      const isOk = await getEmailDupCheck(email);
      if (!isOk) {
        setError('email', {
          type: 'validate',
          message: '이미 가입된 이메일 주소입니다.',
        });
      } else {
        startMailVerification(email).then(() => {
          setPhase(2);
        });
      }
    }
  }, [getValues, setError, startMailVerification, trigger]);

  // * 재전송 버튼 10초간 재클릭 불가능하도록 하는 기능
  const [tempVerifyButtonDisable, setTempVerifyButtonDisable] = useState(false);
  const disableVerifyButton = useCallback(() => {
    setTempVerifyButtonDisable(true);
    setTimeout(() => {
      setTempVerifyButtonDisable(false);
    }, 15 * 1000);
  }, []);

  // * 회원가입 핸들러
  const signup = useSellerSignupMutation();
  const login = useLoginMutation('seller');
  const onSubmit = useCallback(
    async (data: SignUpSellerDto) => {
      const seller = await signup.mutateAsync(data).catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err.response);
        setError('code', {
          type: 'validate',
          message: err?.response.data?.message || err.message,
        });
      });
      if (seller) {
        // 로그인 과정이 수행
        await login.mutateAsync({
          email: data.email,
          password: data.password,
        });
        router.push('/mypage');
      }
    },
    [router, setError, signup],
  );

  return (
    <CenterBox
      enableShadow={enableShadow}
      // TODO : 더미 문구 변경
      header={{ title: '크크쇼 시작하기', desc: '캐치프레이즈 자리입니다.' }}
    >
      <Stack mt={4} spacing={4} as="form" onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.name}>
          <FormLabel htmlFor="name">이름</FormLabel>
          <Input
            id="name"
            type="text"
            placeholder="김민수"
            autoComplete="off"
            isReadOnly={phase === 2}
            {...register('name', {
              required: '이름을 작성해주세요.',
              minLength: { value: 2, message: '이름은 2글자 이상이어야 합니다.' },
            })}
          />
          <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.email}>
          <FormLabel htmlFor="email">이메일</FormLabel>
          <Input
            id="email"
            type="email"
            placeholder="minsu@example.com"
            isReadOnly={phase === 2}
            autoComplete="off"
            {...register('email', { ...emailRegisterOptions })}
          />
          <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.password}>
          <FormLabel htmlFor="password">
            암호
            <Text
              fontSize="xs"
              color={useColorModeValue('gray.500', 'gray.400')}
              as="span"
            >
              (문자,숫자,특수문자 포함 8자 이상)
            </Text>
          </FormLabel>
          <Input
            id="password"
            type="password"
            isReadOnly={phase === 2}
            placeholder="********"
            {...register('password', { ...passwordRegisterOptions })}
          />
          <FormErrorMessage>
            {errors.password && errors.password.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.repassword}>
          <FormLabel htmlFor="password">
            암호 확인
            <Text
              fontSize="xs"
              color={useColorModeValue('gray.500', 'gray.400')}
              as="span"
            >
              (동일한 암호를 입력하세요.)
            </Text>
          </FormLabel>

          <Input
            id="repassword"
            type="password"
            isReadOnly={phase === 2}
            placeholder="********"
            {...register('repassword', {
              required: '암호 확인을 작성해주세요.',
              validate: (value) =>
                value === watch('password') || '암호가 동일하지 않습니다.',
            })}
          />
          <FormErrorMessage>
            {errors.repassword && errors.repassword.message}
          </FormErrorMessage>
        </FormControl>

        {phase === 2 && (
          <FormControl isInvalid={!!errors.code}>
            <FormLabel htmlFor="code">
              이메일 인증 코드
              <Text fontSize="sm" color="gray.500">
                {`${getValues('email')}로 인증코드가 전송되었습니다!`}
              </Text>
              <Text fontSize="sm" color="gray.500">
                인증코드는 6자의 무작위 글자로 이루어져 있습니다.
              </Text>
            </FormLabel>
            <Input
              autoComplete="off"
              id="code"
              type="code"
              placeholder="이메일 인증코드"
              {...register('code', { ...emailCodeRegisterOptions })}
            />
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
                  startMailVerification(getValues('email')).then(disableVerifyButton);
                }}
              >
                재전송
              </Button>
            </Flex>
          </FormControl>
        )}
        <Divider />

        {phase === 1 && (
          <Button
            bg="blue.400"
            color="white"
            _hover={{ bg: 'blue.500' }}
            onClick={checkValidation}
            isLoading={mailVerification.isLoading}
          >
            가입하기
          </Button>
        )}
        {phase === 2 && (
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

        {moveToSignupStart && <Button onClick={moveToSignupStart}>돌아가기</Button>}
      </Stack>
    </CenterBox>
  );
}
