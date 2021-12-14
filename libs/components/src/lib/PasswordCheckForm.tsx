import { Box, Button, ButtonGroup, Input, useToast } from '@chakra-ui/react';
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
  const { register, handleSubmit, reset, watch } = useForm<PasswordCheckFormData>();

  const checkPassword = (data: PasswordCheckFormData): void => {
    const { password } = data;
    if (!email || !password) return;

    mutateAsync({ email, password })
      .then((isValidPassword) => {
        if (isValidPassword) {
          onConfirm();
        } else {
          if (onFail) onFail();
          toast({
            title: '오류 알림',
            description: '비밀번호가 틀렸습니다. 다시 입력해주세요',
            status: 'error',
          });
        }
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: '비밀번호 확인 오류',
          status: 'error',
        });
        if (onFail) onFail();
      })
      .finally(() => reset());
  };
  return (
    <Box as="form" onSubmit={handleSubmit(checkPassword)}>
      <Input type="password" mb={2} {...register('password', { required: true })} />
      <ButtonGroup>
        <Button onClick={onCancel}>취소</Button>
        <Button type="submit" disabled={!watch('password')}>
          비밀번호 확인
        </Button>
      </ButtonGroup>
    </Box>
  );
}

export default PasswordCheckForm;
