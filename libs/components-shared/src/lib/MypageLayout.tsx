import { Box, Flex, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { MypageLink, mypageNavLinks } from '@project-lc/components-constants/navigation';
import LoginRequireAlertDialog from '@project-lc/components-core/LoginRequireAlertDialog';
import MotionBox from '@project-lc/components-core/MotionBox';
import FullscreenLoading from '@project-lc/components-layout/FullscreenLoading';
import MypageFooter from '@project-lc/components-layout/MypageFooter';
import { useDisplaySize, useIsLoggedIn } from '@project-lc/hooks';
import { UserType } from '@project-lc/shared-types';
import React from 'react';
import { FloatingHelpButton } from './FloatingHelpButton';
import MypageBreadcrumb from './MypageBreadCrumb';
import { MypageNavbar } from './MypageNavbar';
import { Navbar, NavbarToggleButton } from './Navbar';

export function DesktopMypageSidebar({
  navLinks,
}: {
  navLinks: Array<MypageLink>;
}): JSX.Element {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  const borderColor = useColorModeValue('gray.200', 'gray.900');
  return (
    <>
      <MotionBox
        initial={isOpen ? 'closed' : 'open'}
        animate={isOpen ? 'closed' : 'open'}
        custom={40}
        variants={variants}
        position="absolute"
        left={0}
        top={0}
      >
        <NavbarToggleButton onToggle={onToggle} isOpen={isOpen} />
      </MotionBox>
      <MotionBox
        initial={isOpen ? 'open' : 'closed'}
        animate={isOpen ? 'open' : 'closed'}
        variants={variants}
        custom={200}
        borderRight={1}
        borderStyle="solid"
        borderColor={borderColor}
      >
        <NavbarToggleButton onToggle={onToggle} isOpen={isOpen} />
        <MypageNavbar navLinks={navLinks} />
      </MotionBox>
    </>
  );
}

interface MypageLayoutProps {
  children: React.ReactNode;
  appType?: UserType;
  navLinks?: Array<MypageLink>;
}

const variants = {
  open: (width: number) => ({
    opacity: 1,
    width,
    display: 'block',
    transition: {
      default: { type: 'spring', bounce: 0, duration: 0.2 },
    },
  }),
  closed: {
    opacity: 0,
    width: 0,
    transition: {
      default: { type: 'spring', bounce: 0, duration: 0.2 },
    },
    transitionEnd: { display: 'none' },
  },
};

export function MypageLayout({
  children,
  appType = 'seller',
  navLinks = mypageNavLinks,
}: MypageLayoutProps): JSX.Element {
  const { status } = useIsLoggedIn();
  const { isMobileSize } = useDisplaySize();

  return (
    <Box
      pointerEvents={status === 'loading' ? 'none' : 'auto'}
      maxH="100vh"
      overflowY="hidden"
    >
      <Navbar appType={appType} />

      <Flex direction="row" position="relative">
        {/* 모바일화면이 아닌경우 사이드바 표시 */}
        {!isMobileSize && <DesktopMypageSidebar navLinks={navLinks} />}

        <Box
          as="main"
          // 모바일 사이즈일때는 푸터 display : none임
          h={{ base: 'calc(100vh - 67px)', md: 'calc(100vh - 67px - 60px)' }}
          flex={1}
          overflow="auto"
        >
          {isMobileSize && <MypageBreadcrumb />}

          {children}
        </Box>
      </Flex>

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
