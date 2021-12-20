import { Box } from '@chakra-ui/react';
import { useIsLoggedIn } from '@project-lc/hooks';
import React from 'react';
import LoginRequireAlertDialog from '../LoginRequireAlertDialog';
import AdminNav from './AdminNav';

interface MypageLayoutProps {
  children: React.ReactNode;
}

// 해당페이지는 관리자이외에는 접근할 수 없도록 해야한다.
export function AdminPageLayout({ children }: MypageLayoutProps): JSX.Element {
  const { status } = useIsLoggedIn();
  return (
    <Box position="relative">
      <AdminNav />

      {/* 로그인 필요 다이얼로그 */}
      <LoginRequireAlertDialog isOpen={status === 'error'} />

      <Box as="main" minH="calc(100vh - 60px - 60px - 60px)">
        {children}
      </Box>
    </Box>
  );
}

export default AdminPageLayout;
