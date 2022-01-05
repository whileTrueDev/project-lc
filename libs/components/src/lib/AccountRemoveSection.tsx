import { Button, Text, useDisclosure } from '@chakra-ui/react';
import { useLogout } from '@project-lc/hooks';
import SettingSectionLayout from '@project-lc/components-layout/SettingSectionLayout';
import AccountRemoveDialog from './AccountRemoveDialog';

export function AccountRemoveSection(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { logout } = useLogout();

  return (
    <SettingSectionLayout title="회원 탈퇴">
      <Text>탈퇴하시면 더 이상 크크쇼에 로그인 할 수 없습니다.</Text>

      <Button width="200px" onClick={onOpen}>
        회원 탈퇴
      </Button>
      <AccountRemoveDialog isOpen={isOpen} onClose={onClose} onRemove={logout} />
    </SettingSectionLayout>
  );
}

export default AccountRemoveSection;
