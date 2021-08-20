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
  // TODO: 임시로 로그인한 유저정보를 여기서 가져옴 추후 global state에서 가져오는걸로 수정하기, email말고 다른정보도 가져와야함
  const { data, isFetching, error } = useProfile();

  return (
    <Box position="relative" pointerEvents={!data || isFetching ? 'none' : 'auto'}>
      <Navbar />

      <MypageNavbar />

      <Box as="main" minH="calc(100vh - 60px - 60px - 60px)">
        {children}
      </Box>

      <MypageFooter />

      {/* 전체화면 로딩 */}
      {(!data || isFetching || !!error) && <FullscreenLoading />}

      {/* 로그인 필요 다이얼로그 */}
      <LoginRequireAlertDialog isOpen={!!error} />
    </Box>
  );
}

export default MypageLayout;
