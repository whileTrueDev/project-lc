import { Box, Button, ButtonGroup, Input, Text } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import SettingSectionLayout from './SettingSectionLayout';

export function PasswordChangeForm(): JSX.Element {
  const { register, handleSubmit, getValues, reset, watch } = useForm();

  // TODO: 회원가입 form ckarh
  const checkPassword = () => {};
  const onCancel = () => {};

  return (
    <SettingSectionLayout title="비밀번호 변경">
      <Text>새로운 비밀번호를 입력해주세요</Text>
      <Box as="form" onSubmit={handleSubmit(checkPassword)}>
        <Input type="password" mb={2} {...register('password', { required: true })} />
        <Input
          type="passwordCheck"
          mb={2}
          {...register('passwordCheck', { required: true })}
        />
        <ButtonGroup>
          <Button onClick={onCancel}>취소</Button>
          <Button type="submit" disabled={!watch('password')}>
            비밀번호 변경
          </Button>
        </ButtonGroup>
      </Box>
    </SettingSectionLayout>
  );
}

export default PasswordChangeForm;
