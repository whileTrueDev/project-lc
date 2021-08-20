import { Box, Button, ButtonGroup, Input, Text, useToast } from '@chakra-ui/react';
import { useProfile, useValidatePassword } from '@project-lc/hooks';
import { useForm } from 'react-hook-form';
import SettingSectionLayout from './SettingSectionLayout';

export interface PasswordCheckFormProps {
  onCancel: () => void;
  onConfirm: () => void;
  onFail?: () => void;
}

// TODO: 비밀번호 확인과정을 넣어야하나???
export function PasswordCheckForm(props: PasswordCheckFormProps): JSX.Element {
  const { onCancel, onConfirm, onFail } = props;
  const toast = useToast();

  // TODO: useProfile 대신 로그인 된 글로벌 상태에서 email값 가져오기
  const { data } = useProfile();
  const { mutateAsync } = useValidatePassword();
  const { register, handleSubmit, getValues, reset } = useForm();

  const checkPassword = () => {
    const password = getValues('password').trim();
    const email = data?.sub;
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
          title: '오류 알림',
          description: error.response.data.message,
          status: 'error',
        });
        if (onFail) onFail();
      })
      .finally(() => reset());
  };
  return (
    <SettingSectionLayout title="암호 확인">
      <Text>회원님의 계정 설정을 변경하기 전 본인확인을 위해 암호를 입력해주세요.</Text>
      <Box as="form" onSubmit={handleSubmit(checkPassword)}>
        <Input {...register('password', { required: true })} />
        <ButtonGroup>
          <Button onClick={onCancel}>취소</Button>
          <Button type="submit">암호 확인</Button>
        </ButtonGroup>
      </Box>
    </SettingSectionLayout>
  );
}

export default PasswordCheckForm;
