import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CloseButton,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { CenterBox } from '@project-lc/components-layout/CenterBox';
import { useHealthCheck, useLoginMutation } from '@project-lc/hooks';
import { LoginUserDto } from '@project-lc/shared-types';
import { getAdminHost } from '@project-lc/utils';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

interface LoginFormProps {
  enableShadow?: boolean;
}

export function AdminLoginForm({ enableShadow = false }: LoginFormProps): JSX.Element {
  useHealthCheck(); // for getting csrftoken

  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<LoginUserDto>();

  // * 로그인 오류 상태 (전체 form 오류. not 필드 오류)
  const [formError, setFormError] = useState('');
  const resetFormError = (): void => {
    setFormError('');
  };

  const login = useLoginMutation('admin');
  const onSubmit = useCallback(
    async (data: LoginUserDto) => {
      const user = await login
        .mutateAsync({ ...data, stayLogedIn: true })
        .catch((err) => {
          setFormError(getMessage(err?.response.data?.statusCode));
        });
      if (user) {
        router.push(`${getAdminHost()}/admin`);
      }
    },
    [router, setFormError, login],
  );

  function getMessage(statusCode: number | undefined): string {
    if (statusCode === 401) {
      return '가입하지 않은 아이디이거나, 잘못된 비밀번호입니다.';
    }
    return '잠시후 다시 로그인 해주세요.';
  }

  return (
    <CenterBox
      enableShadow={enableShadow}
      header={{ title: '로그인', desc: '관리자 계정' }}
    >
      <Stack mt={4} spacing={4} as="form" onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.email}>
          <FormLabel htmlFor="email">이메일</FormLabel>
          <Input
            id="email"
            type="email"
            placeholder="kkshow@example.com"
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
      </Stack>
      <Stack spacing={1} mt={2}>
        <NextLink href="/signup" passHref>
          <Link
            ml={2}
            color={useColorModeValue('blue.500', 'blue.400')}
            textDecoration="underline"
          >
            가입하기
          </Link>
        </NextLink>
      </Stack>
    </CenterBox>
  );
}

export default AdminLoginForm;
