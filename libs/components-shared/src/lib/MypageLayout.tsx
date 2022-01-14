import { Box } from '@chakra-ui/react';
import { MypageLink, mypageNavLinks } from '@project-lc/components-constants/navigation';
import LoginRequireAlertDialog from '@project-lc/components-core/LoginRequireAlertDialog';
import FullscreenLoading from '@project-lc/components-layout/FullscreenLoading';
import MypageFooter from '@project-lc/components-layout/MypageFooter';
import { useIsLoggedIn } from '@project-lc/hooks';
import { UserType } from '@project-lc/shared-types';
import React from 'react';
import MypageBreadcrumb from './MypageBreadCrumb';
import { FloatingHelpButton } from './FloatingHelpButton';
import { MypageNavbar } from './MypageNavbar';
import { Navbar } from './Navbar';

interface MypageLayoutProps {
  children: React.ReactNode;
  appType?: UserType;
  navLinks?: Array<MypageLink>;
}

export function MypageLayout({
  children,
  appType = 'seller',
  navLinks = mypageNavLinks,
}: MypageLayoutProps): JSX.Element {
  const { status } = useIsLoggedIn();

  return (
    <Box position="relative" pointerEvents={status === 'loading' ? 'none' : 'auto'}>
      <Navbar appType={appType} />
      <MypageNavbar navLinks={navLinks} />
      <MypageBreadcrumb />
      <Box as="main" minH="calc(100vh - 60px - 60px - 60px)">
        {children}
      </Box>
      <MypageFooter />
      {/* 전체화면 로딩 */}
      {status === 'loading' && <FullscreenLoading />}
      {/* 로그인 필요 다이얼로그 */}
      <LoginRequireAlertDialog isOpen={status === 'error'} />
      {/* 클릭한번에 실시간 상담 버튼 */}
      <FloatingHelpButton />
    </Box>
  );
}

export default MypageLayout;
