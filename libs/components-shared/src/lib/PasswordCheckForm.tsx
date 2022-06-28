import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  Input,
  useToast,
} from '@chakra-ui/react';
import { useValidatePassword } from '@project-lc/hooks';
import { useForm } from 'react-hook-form';

export interface PasswordCheckFormData {
  password: string;
}
export interface PasswordCheckFormProps {
  email?: string;
  onCancel: () => void;
  onConfirm: () => void;
  onFail?: () => void;
}

export function PasswordCheckForm(props: PasswordCheckFormProps): JSX.Element {
  const { onCancel, onConfirm, onFail, email } = props;
  const toast = useToast();

  const { mutateAsync } = useValidatePassword();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    setError,
  } = useForm<PasswordCheckFormData>();

  const checkPassword = (data: PasswordCheckFormData): void => {
    const { password } = data;
    if (!email || !password) return;

    mutateAsync({ email, password })
      .then((isValidPassword) => {
        if (isValidPassword) {
          onConfirm();
        } else {
          if (onFail) onFail();
          setError('password', { message: '비밀번호를 올바르게 입력해주세요' });
          toast({
            title: '오류 알림',
            description: '비밀번호가 틀렸습니다. 다시 입력해주세요',
            status: 'error',
          });
        }
      })
      .catch((error) => {
        console.error(error);
        toast({ title: '비밀번호 확인 오류', status: 'error' });
        if (onFail) onFail();
        reset();
      });
  };

  return (
    <Box as="form" onSubmit={handleSubmit(checkPassword)}>
      <FormControl isInvalid={!!errors.password}>
        <Input
          type="password"
          mb={2}
          {...register('password', { required: '비밀번호를 입력해주세요.' })}
        />
        <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
      </FormControl>
      <ButtonGroup mt={2} width="100%" justifyContent="flex-end">
        <Button onClick={onCancel}>취소</Button>
        <Button colorScheme="blue" type="submit" disabled={!watch('password')}>
          비밀번호 확인
        </Button>
      </ButtonGroup>
    </Box>
  );
}

export default PasswordCheckForm;
