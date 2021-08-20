import { Button, ButtonGroup, Input, Text } from '@chakra-ui/react';
import { useProfile } from '@project-lc/hooks';
import SettingSectionLayout from './SettingSectionLayout';

export interface PasswordCheckFormProps {
  onCancel: () => void;
  onConfirm: () => void;
  onFail: () => void;
}

export function PasswordCheckForm(props: PasswordCheckFormProps): JSX.Element {
  const { onCancel, onConfirm, onFail } = props;
  // TODO: useProfile 대신 로그인 된 글로벌 상태에서 email값 가져오기
  const { data } = useProfile();

  // mutation check password
  // -> success: onConfirm callback 실행
  // -> fail : onFail callback 실행
  return (
    <SettingSectionLayout title="암호 확인">
      <Text>회원님의 계정 설정을 변경하기 전 본인확인을 위해 암호를 입력해주세요.</Text>
      <Input />
      <ButtonGroup>
        <Button onClick={onCancel}>취소</Button>
        <Button onClick={onConfirm}>암호 확인</Button>
      </ButtonGroup>
    </SettingSectionLayout>
  );
}

export default PasswordCheckForm;
