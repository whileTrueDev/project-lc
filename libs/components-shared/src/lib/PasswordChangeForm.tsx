import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useChangePasswordMutation } from '@project-lc/hooks';
import { passwordRegisterOptions } from '@project-lc/shared-types';
import { useForm } from 'react-hook-form';
import { PasswordCheckFormProps } from './PasswordCheckForm';

export interface PasswordCheckFormData {
  password: string;
  repassword: string;
}
export type PasswordChangeFormProps = PasswordCheckFormProps;
export function PasswordChangeForm(props: PasswordChangeFormProps): JSX.Element {
  const { onCancel, onConfirm, email } = props;
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PasswordCheckFormData>();

  const { mutateAsync } = useChangePasswordMutation();

  const changePassword = (data: PasswordCheckFormData): void => {
    if (!email) return;

    const { password } = data;
    mutateAsync({ email, password })
      .then((res) => {
        toast({
          title: `새 비밀번호 등록 성공`,
          status: 'success',
        });
        onConfirm();
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: `새 비밀번호 등록 실패`,
          status: 'error',
        });
        onCancel();
      })
      .finally(() => {
        reset();
      });
  };

  return (
    <Box as="form" onSubmit={handleSubmit(changePassword)} id="password-change-form">
      {/* SignupForm 참고 */}
      <FormControl isInvalid={!!errors.password} mb={2}>
        <FormLabel htmlFor="password">
          비밀번호
          <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')} as="span">
            (문자,숫자,특수문자 포함 8자 이상)
          </Text>
        </FormLabel>
        <Input
          autoComplete="off"
          id="password"
          type="password"
          placeholder="********"
          {...register('password', { ...passwordRegisterOptions })}
        />
        <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.repassword} mb={4}>
        <FormLabel htmlFor="password">
          비밀번호 확인
          <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')} as="span">
            (동일한 비밀번호를 입력하세요.)
          </Text>
        </FormLabel>

        <Input
          id="repassword"
          type="password"
          placeholder="********"
          {...register('repassword', {
            required: '비밀번호 확인을 작성해주세요.',
            validate: (value) =>
              value === watch('password') || '비밀번호가 동일하지 않습니다.',
          })}
        />
        <FormErrorMessage>
          {errors.repassword && errors.repassword.message}
        </FormErrorMessage>
      </FormControl>
    </Box>
  );
}

export default PasswordChangeForm;
