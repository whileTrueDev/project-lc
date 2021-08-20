import { Button, Text, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import AccountRemoveDialog from './AccountRemoveDialog';
import SettingSectionLayout from './SettingSectionLayout';

export function AccountRemoveSection(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const logout = () => {
    console.log('로그아웃 처리');
    // 로그아웃요청(토큰삭제)
    // 프론트에서 글로벌에 저장하고 있는 유저정보 삭제
  };

  const onRemove = () => {
    logout();
    router.push('/');
  };
  return (
    <SettingSectionLayout title="회원 탈퇴">
      <>
        <Text>탈퇴하시면 더 이상 project-lc에 로그인 할 수 없습니다.</Text>

        <Button width="200px" onClick={onOpen}>
          회원 탈퇴
        </Button>
        <AccountRemoveDialog isOpen={isOpen} onClose={onClose} onRemove={onRemove} />
      </>
    </SettingSectionLayout>
  );
}

export default AccountRemoveSection;
