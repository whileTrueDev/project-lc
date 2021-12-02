import { Box } from '@chakra-ui/react';
import { useIsLoggedIn } from '@project-lc/hooks';
import React from 'react';
import { MypageLink, mypageNavLinks } from '..';
import { SiteType } from '../constants/siteType';
import FullscreenLoading from './FullscreenLoading';
import LoginRequireAlertDialog from './LoginRequireAlertDialog';
import MypageFooter from './MypageFooter';
import { MypageNavbar } from './MypageNavbar';
import { Navbar } from './Navbar';

interface MypageLayoutProps {
  children: React.ReactNode;
  siteType?: SiteType;
  navLinks?: Array<MypageLink>;
}

export function MypageLayout({
  children,
  siteType = 'seller',
  navLinks = mypageNavLinks,
}: MypageLayoutProps): JSX.Element {
  const { status } = useIsLoggedIn();

  return (
    <Box position="relative" pointerEvents={status === 'loading' ? 'none' : 'auto'}>
      <Navbar siteType={siteType} />

      <MypageNavbar navLinks={navLinks} />

      <Box as="main" minH="calc(100vh - 60px - 60px - 60px)">
        {children}
      </Box>

      <MypageFooter />

      {/* 전체화면 로딩 */}
      {status === 'loading' && <FullscreenLoading />}

      {/* 로그인 필요 다이얼로그 */}
      <LoginRequireAlertDialog isOpen={status === 'error'} />
    </Box>
  );
}

export default MypageLayout;
