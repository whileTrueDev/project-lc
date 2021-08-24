import { Box, Button, ButtonGroup, Input, Text, useToast } from '@chakra-ui/react';
import { useProfile, useValidatePassword } from '@project-lc/hooks';
import { useForm } from 'react-hook-form';
import SettingSectionLayout from './SettingSectionLayout';

export interface PasswordCheckFormData {
  password: string;
}
export interface PasswordCheckFormProps {
  onCancel: () => void;
  onConfirm: () => void;
  onFail?: () => void;
}

export function PasswordCheckForm(props: PasswordCheckFormProps): JSX.Element {
  const { onCancel, onConfirm, onFail } = props;
  const toast = useToast();

  const { data: profileData } = useProfile();
  const { mutateAsync } = useValidatePassword();
  const { register, handleSubmit, reset, watch } = useForm<PasswordCheckFormData>();

  const checkPassword = (data: PasswordCheckFormData) => {
    const { password } = data;
    const email = profileData?.email;
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
    <SettingSectionLayout title="비밀번호 확인">
      <Text>
        회원님의 계정 설정을 변경하기 전 본인확인을 위해 비밀번호를 입력해주세요.
      </Text>
      <Box as="form" onSubmit={handleSubmit(checkPassword)}>
        <Input type="password" mb={2} {...register('password', { required: true })} />
        <ButtonGroup>
          <Button onClick={onCancel}>취소</Button>
          <Button type="submit" disabled={!watch('password')}>
            비밀번호 확인
          </Button>
        </ButtonGroup>
      </Box>
    </SettingSectionLayout>
  );
}

export default PasswordCheckForm;
