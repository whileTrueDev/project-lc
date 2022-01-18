import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Container,
  Flex,
  IconButton,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
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

const variants = {
  open: (width: number | string) => ({
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

export function DesktopMypageSidebar({
  navLinks,
}: {
  navLinks: Array<MypageLink>;
}): JSX.Element {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  const borderColor = useColorModeValue('gray.200', 'gray.900');
  return (
    <>
      {/* 마이페이지 사이드바 여는 버튼 */}
      <MotionBox
        initial={isOpen ? 'closed' : 'open'}
        animate={isOpen ? 'closed' : 'open'}
        custom="100%"
        variants={variants}
        position="absolute"
        left={0}
        top={0}
      >
        <IconButton
          onClick={onToggle}
          icon={<ArrowRightIcon />}
          variant="ghost"
          aria-label="Toggle Navigation"
        />
      </MotionBox>

      {/* 마이페이지 사이드바 */}
      <MotionBox
        initial={isOpen ? 'open' : 'closed'}
        animate={isOpen ? 'open' : 'closed'}
        variants={variants}
        custom="200px"
        borderRight={1}
        borderStyle="solid"
        borderColor={borderColor}
        color={useColorModeValue('gray.500', 'gray.400')}
      >
        <Box textAlign="right">
          {/* 마이페이지 사이드바 닫는 버튼 */}
          <IconButton
            onClick={onToggle}
            icon={<ArrowLeftIcon />}
            variant="ghost"
            aria-label="Toggle Navigation"
          />
        </Box>

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
      {/* 상단 네비바 */}
      <Navbar appType={appType} />
      {/* 가운데 영역 */}
      <Flex direction="row" position="relative">
        {/* 사이드바 표시(모바일화면이 아닌경우 ) */}
        {!isMobileSize && <DesktopMypageSidebar navLinks={navLinks} />}
        {/* 마이페이지 메인 컨텐츠 영역 */}
        <Box
          as="main"
          h={{
            base: 'calc(100vh - 67px)', // 모바일 사이즈일때 푸터는 표시되지 않으므로 푸터높이는 제외하지 않는다
            md: 'calc(100vh - 67px - 60px)',
          }}
          flex={1}
          overflow="auto"
        >
          {/* 브레드크럼 네비게이션 표시(모바일화면인 경우에만) */}
          {isMobileSize && <MypageBreadcrumb />}
          {/* 실제 메인 컨텐츠 표시 */}
          <Container maxW="8xl">{children}</Container>
        </Box>
      </Flex>
      {/* 푸터 */}
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
