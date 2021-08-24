import { Box, Center, Spinner } from '@chakra-ui/react';
import { useProfile } from '@project-lc/hooks';
import React from 'react';
import FullscreenLoading from './FullscreenLoading';
import LoginRequireAlertDialog from './LoginRequireAlertDialog';
import MypageFooter from './MypageFooter';
import { MypageNavbar } from './MypageNavbar';
import { Navbar } from './Navbar';

interface MypageLayoutProps {
  children: React.ReactNode;
}

export function MypageLayout({ children }: MypageLayoutProps): JSX.Element {
  const { data, isLoading, error } = useProfile();

  return (
    <Box position="relative" pointerEvents={!data || isLoading ? 'none' : 'auto'}>
      <Navbar />

      <MypageNavbar />

      <Box as="main" minH="calc(100vh - 60px - 60px - 60px)">
        {children}
      </Box>

      <MypageFooter />

      {/* 전체화면 로딩 */}
      {(!data || isLoading || !!error) && <FullscreenLoading />}

      {/* 로그인 필요 다이얼로그 */}
      <LoginRequireAlertDialog isOpen={!!error} />
    </Box>
  );
}

export default MypageLayout;
