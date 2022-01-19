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
import { Navbar } from './Navbar';
import { NavbarToggleButton } from './navbar/NavbarToggleButton';

const NAVBAR_HEIGHT = 67;
const FOOTER_HEIGHT = 60;
const variants = {
  open: (width: number | string) => ({
    opacity: 1,
    width,
    display: 'block',
    transition: {
      default: { type: 'twin', duration: 0.5 },
    },
  }),
  closed: {
    opacity: 0,
    width: 0,
    transition: {
      default: { type: 'twin', duration: 0.5 },
    },
    transitionEnd: { display: 'none' },
  },
};

export function DesktopMypageSidebar({
  navLinks,
  isOpen,
  onToggle,
}: {
  navLinks: Array<MypageLink>;
  isOpen: boolean;
  onToggle: () => void;
}): JSX.Element {
  const borderColor = useColorModeValue('gray.200', 'gray.900');
  return (
    <MotionBox
      position="relative"
      initial={isOpen ? 'open' : 'closed'}
      animate={isOpen ? 'open' : 'closed'}
      variants={variants}
      custom="200px"
      borderRight={1}
      borderStyle="solid"
      borderColor={borderColor}
      color={useColorModeValue('gray.500', 'gray.400')}
    >
      {/* 마이페이지 사이드바 닫는 버튼 */}
      <Flex
        w="100%"
        alignItems="center"
        justifyContent="flex-end"
        h={`${NAVBAR_HEIGHT}px`}
      >
        <NavbarToggleButton onToggle={onToggle} isOpen={isOpen} />
      </Flex>

      <MypageNavbar navLinks={navLinks} />
    </MotionBox>
  );
}

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
  const { isMobileSize } = useDisplaySize();
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

  return (
    <Flex
      direction="row"
      maxH="100vh"
      overflowY="hidden"
      pointerEvents={status === 'loading' ? 'none' : 'auto'}
    >
      {/* 사이드바 영역 */}
      {!isMobileSize && (
        <DesktopMypageSidebar navLinks={navLinks} isOpen={isOpen} onToggle={onToggle} />
      )}
      {/* 사이드바 제외한 영역 */}
      <Box flex="1">
        {/* 상단 네비바 */}
        <Navbar
          appType={appType}
          desktopSidebarToggleButton={
            // 사이드바 토글버튼
            <MotionBox
              initial={isOpen ? 'closed' : 'open'}
              animate={isOpen ? 'closed' : 'open'}
              custom="40px"
              variants={variants}
            >
              <NavbarToggleButton onToggle={onToggle} isOpen={isOpen} />
            </MotionBox>
          }
        />
        {/* 중간 영역 */}
        <Flex direction="row" position="relative">
          {/* 마이페이지 메인 컨텐츠 영역(스크롤되는 영역) */}
          <Box
            as="main"
            h={{
              base: `calc(100vh - ${NAVBAR_HEIGHT}px)`, // 모바일 사이즈일때 푸터는 표시되지 않으므로 푸터높이는 제외하지 않는다
              md: `calc(100vh - ${NAVBAR_HEIGHT}px - ${FOOTER_HEIGHT}px)`,
            }}
            flex={1}
            overflow="auto"
          >
            {/* 브레드크럼 네비게이션 표시 */}
            <MypageBreadcrumb />
            {/* 실제 메인 컨텐츠 표시 */}
            {children}
          </Box>
        </Flex>
        {/* 하단 푸터 */}
        <MypageFooter />

        {/* 전체화면 로딩 */}
        {status === 'loading' && <FullscreenLoading />}
        {/* 로그인 필요 다이얼로그 */}
        <LoginRequireAlertDialog isOpen={status === 'error'} />
        {/* 클릭한번에 실시간 상담 버튼 */}
        <FloatingHelpButton />
      </Box>
    </Flex>
  );
}

export default MypageLayout;
