import { Box, Flex, useDisclosure } from '@chakra-ui/react';
import LoginRequireAlertDialog from '@project-lc/components-core/LoginRequireAlertDialog';
import { useIsLoggedIn } from '@project-lc/hooks';
import React from 'react';
import { NavbarToggleButton } from '@project-lc/components-shared/navbar/NavbarToggleButton';
import { AdminNav } from './AdminNav';
import AdminSidebar from './AdminSidebar';

interface MypageLayoutProps {
  children: React.ReactNode;
}

// 해당페이지는 관리자이외에는 접근할 수 없도록 해야한다.
export function AdminPageLayout({ children }: MypageLayoutProps): JSX.Element {
  const { status } = useIsLoggedIn();
  // 사이드바 토글버튼
  const { isOpen, onClose, onToggle } = useDisclosure({ defaultIsOpen: true });

  return (
    <Box position="relative" maxH="100vh" overflowY="hidden">
      <AdminNav
        toggleButton={
          isOpen ? null : <NavbarToggleButton isOpen={isOpen} onToggle={onToggle} />
        }
      />

      {/* 로그인 필요 다이얼로그 */}
      <LoginRequireAlertDialog isOpen={status === 'error'} />

      <Flex as="main" minH="calc(100vh - 60px - 60px - 60px)" direction="row">
        <AdminSidebar isOpen={isOpen} onClose={onClose} onToggle={onToggle} />
        <Box flex="1" p={4} h="calc(100vh - 60px)" overflow="auto">
          {children}
        </Box>
      </Flex>
    </Box>
  );
}

export default AdminPageLayout;
