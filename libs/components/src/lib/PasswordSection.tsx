import { Button, Text, useBoolean, useDisclosure } from '@chakra-ui/react';
import { useProfile } from '@project-lc/hooks';
import PasswordChangeDialog from './PasswordChangeDialog';
import PasswordCheckDialog from './PasswordCheckDialog';
import SettingSectionLayout from './SettingSectionLayout';

export function PasswordSection(): JSX.Element {
  const { data } = useProfile();
  const {
    isOpen: pwCheckFlag,
    onOpen: openPwCheckDialog,
    onClose: closePwCheckDialog,
  } = useDisclosure();
  const {
    isOpen: pwChangeflag,
    onOpen: openPwChangeDialog,
    onClose: closePwChangeDialog,
  } = useDisclosure();

  const hasPassword = data?.hasPassword;
  return (
    <SettingSectionLayout title="비밀번호">
      {hasPassword ? (
        <Button width="200px" onClick={openPwCheckDialog}>
          비밀번호 변경하기
        </Button>
      ) : (
        <>
          <Text>비밀번호가 등록되어 있지 않습니다. </Text>
          <Text>이메일과 비밀번호로 로그인을 하기 위해서는 비밀번호를 등록해주세요.</Text>
          <Button width="200px" onClick={openPwChangeDialog}>
            비밀번호 등록하기
          </Button>
        </>
      )}
      <PasswordCheckDialog
        isOpen={pwCheckFlag}
        onClose={closePwCheckDialog}
        onConfirm={() => {
          closePwCheckDialog();
          openPwChangeDialog();
        }}
      />
      <PasswordChangeDialog
        isOpen={pwChangeflag}
        onClose={closePwChangeDialog}
        onConfirm={closePwChangeDialog}
      />
    </SettingSectionLayout>
  );
}

export default PasswordSection;
