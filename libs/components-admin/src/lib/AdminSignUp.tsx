import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { CenterBox } from '@project-lc/components-layout/CenterBox';
import {
  getEmailDupCheck,
  useAdministratorSignupMutation,
  useLoginMutation,
} from '@project-lc/hooks';
import {
  AdminSignUpDto,
  emailRegisterOptions,
  passwordRegisterOptions,
} from '@project-lc/shared-types';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Administrator } from '.prisma/client';

export function AdminSignUp(): JSX.Element {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    trigger,
    getValues,
    setError,
    watch,
  } = useForm<AdminSignUpDto & { repassword: string }>();

  // * 관리자 회원가입 유효성 체크
  const checkValidation = useCallback(async (): Promise<boolean> => {
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
      }
      return isOk;
    }
    return false;
  }, [getValues, setError, trigger]);

  const adminSignup = useAdministratorSignupMutation();
  const login = useLoginMutation('admin');
  const onSubmit = useCallback(
    async (data: AdminSignUpDto) => {
      const isOk = await checkValidation();
      if (!isOk) {
        return;
      }
      const user: void | Administrator = await adminSignup.mutateAsync(data);
      if (user) {
        // 로그인 과정이 수행
        await login.mutateAsync({
          email: data.email,
          password: data.password,
          stayLogedIn: true,
        });
        router.push('/admin');
      }
    },
    [login, router, checkValidation, adminSignup],
  );

  return (
    <CenterBox header={{ title: '관리자 계정 만들기', desc: '' }}>
      <Stack mt={4} spacing={4} as="form" onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.email}>
          <FormLabel htmlFor="email">이메일</FormLabel>
          <Input
            id="email"
            type="email"
            placeholder="minsu@example.com"
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
        <Button
          bg="blue.400"
          color="white"
          type="submit"
          _hover={{ bg: 'blue.500' }}
          isLoading={isSubmitting}
        >
          가입하기
        </Button>
      </Stack>
    </CenterBox>
  );
}
