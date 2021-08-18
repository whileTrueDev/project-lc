/* eslint-disable react/jsx-props-no-spreading */
import { useRouter } from 'next/router';
import { LoginSellerDto } from '@project-lc/shared-types';
import { useLoginMutation } from '@project-lc/hooks';
import { useCallback } from 'react';
import {
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { CenterBox } from './CenterBox';
import SocialButtonGroup from './SocialButtonGroup';

export interface LoginFormProps {
  enableShadow?: boolean;
}

export function LoginForm({ enableShadow = false }: LoginFormProps): JSX.Element {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginSellerDto>();

  // * 로그인 핸들러
  const login = useLoginMutation();
  const onSubmit = useCallback(
    async (data: LoginSellerDto) => {
      const seller = await login.mutateAsync(data).catch((err) => {
        // eslint-disable-next-line no-console
        setError('email', {
          type: 'validate',
          message: getMessage(err?.response.data?.statusCode),
        });
      });
      if (seller) {
        router.push('/');
      }
    },
    [router, setError, login],
  );

  function getMessage(statusCode: number | undefined) {
    if (statusCode === 401) {
      return '가입하지 않은 아이디이거나, 잘못된 비밀번호입니다.';
    }
    return '잠시후 다시 로그인 해주세요.';
  }

  return (
    <CenterBox
      enableShadow={enableShadow}
      header={{ title: '로그인', desc: '캐치프레이즈 자리입니다.' }}
    >
      <Stack mt={4} spacing={4} as="form" onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.email}>
          <FormLabel htmlFor="email">이메일</FormLabel>
          <Input
            id="email"
            type="email"
            placeholder="minsu@example.com"
            autoComplete="off"
            {...register('email', {
              required: '이메일을 작성해주세요.',
            })}
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
            {...register('password', {
              required: '암호를 작성해주세요.',
              minLength: { value: 8, message: '비밀번호는 8자 이상이어야 합니다.' },
              maxLength: { value: 20, message: '비밀번호는 20자 이하여야 합니다.' },
              pattern: {
                value: /^(?=.*[a-zA-Z0-9])(?=.*[!@#$%^*+=-]).{8,20}$/,
                message: '형식이 올바르지 않습니다.',
              },
            })}
          />
          <FormErrorMessage>
            {errors.password && errors.password.message}
          </FormErrorMessage>
        </FormControl>
        <Divider />
        <Button
          bg="blue.400"
          color="white"
          _hover={{ bg: 'blue.500' }}
          type="submit"
          isLoading={isSubmitting}
        >
          로그인
        </Button>
        <SocialButtonGroup />
      </Stack>
    </CenterBox>
  );
}

export default LoginForm;
