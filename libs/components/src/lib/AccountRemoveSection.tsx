import { Button, Text, useDisclosure } from '@chakra-ui/react';
import { useLogoutMutation } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';
import AccountRemoveDialog from './AccountRemoveDialog';
import SettingSectionLayout from './SettingSectionLayout';

export function AccountRemoveSection(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { mutateAsync } = useLogoutMutation();
  const queryClient = useQueryClient();

  const logout = () => {
    // 프론트에서 글로벌에 저장하고 있는 유저정보 삭제
    queryClient.removeQueries('Profile', { exact: true });
    // 로그아웃요청(토큰삭제)
    mutateAsync().then((res) => {
      console.log(res);
      router.push('/');
    });
  };

  return (
    <SettingSectionLayout title="회원 탈퇴">
      <>
        <Text>탈퇴하시면 더 이상 project-lc에 로그인 할 수 없습니다.</Text>

        <Button width="200px" onClick={onOpen}>
          회원 탈퇴
        </Button>
        <AccountRemoveDialog isOpen={isOpen} onClose={onClose} onRemove={logout} />
      </>
    </SettingSectionLayout>
  );
}

export default AccountRemoveSection;
