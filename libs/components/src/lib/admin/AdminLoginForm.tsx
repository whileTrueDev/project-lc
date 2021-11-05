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
  Stack,
} from '@chakra-ui/react';
import { useLoginMutation } from '@project-lc/hooks';
import { LoginSellerDto } from '@project-lc/shared-types';
import { getApiHost } from '@project-lc/utils';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CenterBox } from '../CenterBox';

interface LoginFormProps {
  enableShadow?: boolean;
}

export function AdminLoginForm({ enableShadow = false }: LoginFormProps): JSX.Element {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<LoginSellerDto>();

  // * 로그인 오류 상태 (전체 form 오류. not 필드 오류)
  const [formError, setFormError] = useState('');
  function resetFormError(): void {
    setFormError('');
  }

  // * 로그인 핸들러 -> admin으로 변경이 필요함.
  const login = useLoginMutation('admin');
  const onSubmit = useCallback(
    async (data: LoginSellerDto) => {
      const seller = await login
        .mutateAsync({ ...data, stayLogedIn: true })
        .catch((err) => {
          setFormError(getMessage(err?.response.data?.statusCode));
        });
      if (seller) {
        router.push(`${getApiHost()}/admin`);
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
    </CenterBox>
  );
}

export default AdminLoginForm;
