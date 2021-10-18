import { useRouter } from 'next/router';
import { LoginSellerDto } from '@project-lc/shared-types';
import { useLoginMutation } from '@project-lc/hooks';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  CloseButton,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useCallback, useState } from 'react';
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
    setValue,
  } = useForm<LoginSellerDto>();

  // * 로그인 오류 상태 (전체 form 오류. not 필드 오류)
  const [formError, setFormError] = useState('');
  function resetFormError(): void {
    setFormError('');
  }

  // * 로그인 핸들러
  const login = useLoginMutation('seller');
  const onSubmit = useCallback(
    async (data: LoginSellerDto) => {
      const seller = await login.mutateAsync(data).catch((err) => {
        setFormError(getMessage(err?.response.data?.status));
        setValue('password', '');
      });
      if (seller) {
        router.push('/');
      }
    },
    [login, setValue, router],
  );

  function getMessage(statusCode: number | undefined): string {
    if (statusCode === 401) {
      return '가입하지 않은 아이디이거나, 잘못된 비밀번호입니다.';
    }
    if (statusCode === 400) {
      return '소셜 계정으로 가입된 회원입니다. 소셜 계정으로 시작하기를 이용해주세요.';
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
            {...register('email', { required: '이메일을 작성해주세요.' })}
          />
          <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.password}>
          <FormLabel htmlFor="password">암호</FormLabel>
          <Input
            id="password"
            type="password"
            placeholder="********"
            {...register('password', { required: '암호를 작성해주세요.' })}
          />
          <FormErrorMessage>
            {errors.password && errors.password.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl>
          <Checkbox size="sm" {...register('stayLogedIn')}>
            로그인 상태 유지
          </Checkbox>
        </FormControl>
        {formError && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle fontSize="sm">{formError}</AlertTitle>
            <CloseButton onClick={resetFormError} />
          </Alert>
        )}

        <Box>
          <Button
            isFullWidth
            bg="blue.400"
            color="white"
            _hover={{ bg: 'blue.500' }}
            type="submit"
            isLoading={isSubmitting}
            onClick={resetFormError}
          >
            로그인
          </Button>
        </Box>

        <Box pb={2}>
          <SocialButtonGroup />
        </Box>

        <Stack spacing={1} mt={2}>
          <NextLink href="/resetPassword" passHref>
            <Link fontSize="sm" textDecoration="underline">
              암호를 잊어버리셨나요?
            </Link>
          </NextLink>
          <Text fontSize="sm">
            처음 오셨나요?
            <NextLink href="/signup" passHref>
              <Link
                ml={2}
                color={useColorModeValue('blue.500', 'blue.400')}
                textDecoration="underline"
              >
                가입하기
              </Link>
            </NextLink>
          </Text>
        </Stack>
      </Stack>
    </CenterBox>
  );
}

export default LoginForm;
