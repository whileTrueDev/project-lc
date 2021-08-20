import { Button, Text, useBoolean, useDisclosure } from '@chakra-ui/react';
import AccountRemoveDialog from './AccountRemoveDialog';
import PasswordCheckForm from './PasswordCheckForm';
import SettingSectionLayout from './SettingSectionLayout';

export function AccountRemoveSection(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [flag, { on, off }] = useBoolean();
  const onRemove = () => console.log('delete');
  return (
    <SettingSectionLayout title="회원 탈퇴">
      <>
        <Text>탈퇴하시면 더 이상 project-lc에 로그인 할 수 없습니다.</Text>

        {flag ? (
          <PasswordCheckForm
            onCancel={() => off()}
            onConfirm={() => {
              off();
              onOpen();
            }}
            onFail={() => off()}
          />
        ) : (
          <Button width="200px" onClick={on}>
            회원 탈퇴
          </Button>
        )}
        <AccountRemoveDialog isOpen={isOpen} onClose={onClose} onRemove={onRemove} />
      </>
    </SettingSectionLayout>
  );
}

export default AccountRemoveSection;
