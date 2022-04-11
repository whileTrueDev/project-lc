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
import { CenterBox } from '@project-lc/components-layout/CenterBox';
import { useLoginMutation, InactiveUserPayload } from '@project-lc/hooks';
import { LoginUserDto, UserType } from '@project-lc/shared-types';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { inactiveEmailStore } from '@project-lc/stores';
import SocialButtonGroup from './SocialButtonGroup';

export interface LoginFormProps {
  enableShadow?: boolean;
  userType: UserType;
}

export function LoginForm({
  enableShadow = false,
  userType,
}: LoginFormProps): JSX.Element {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<LoginUserDto>({
    defaultValues: { stayLogedIn: true },
  });
  const { setToActivateEmail } = inactiveEmailStore();
  // * 로그인 오류 상태 (전체 form 오류. not 필드 오류)
  const [formError, setFormError] = useState('');
  const resetFormError = (): void => {
    setFormError('');
  };

  // * 로그인 핸들러
  const login = useLoginMutation(userType);

  const onSubmit = useCallback(
    async (data: LoginUserDto) => {
      const user = await login.mutateAsync(data).catch((err) => {
        setFormError(getMessage(err?.response.data?.status));
        setValue('password', '');
      });
      if (user && (user as InactiveUserPayload).inactiveFlag) {
        setToActivateEmail((user as InactiveUserPayload).sub);
        router.push('/activate');
        return;
      }
      if (user) {
        router.push('/mypage');
      }
    },
    [login, setValue, router, setToActivateEmail],
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
    <CenterBox enableShadow={enableShadow} header={{ title: '로그인', desc: '' }}>
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
          <SocialButtonGroup userType={userType} />
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
