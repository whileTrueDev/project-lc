import { Box, Flex } from '@chakra-ui/react';
import { UserType } from '@prisma/client';
import {
  broadcasterCenterMypageNavLinks,
  MypageLink,
  mypageNavLinks,
} from '@project-lc/components-constants/navigation';
import LoginRequireAlertDialog from '@project-lc/components-core/LoginRequireAlertDialog';
import FullscreenLoading from '@project-lc/components-layout/FullscreenLoading';
import MypageFooter from '@project-lc/components-layout/MypageFooter';
import { useDisplaySize, useIsLoggedIn } from '@project-lc/hooks';
import { FloatingHelpButton } from './FloatingHelpButton';
import { MypageToolbar } from './MypageToolbar';
import { Navbar } from './Navbar';
import DesktopMypageSidebar from './navbar/DesktopMypageSidebar';

const NAVBAR_HEIGHT = 67;
const FOOTER_HEIGHT = 60;

export interface MypageLayoutProps {
  children: React.ReactNode;
  appType?: UserType;
  navLinks?: Array<MypageLink>;
}

export function MypageLayout({
  children,
  appType = 'seller',
  navLinks = appType === 'seller' ? mypageNavLinks : broadcasterCenterMypageNavLinks,
}: MypageLayoutProps): JSX.Element {
  const { status } = useIsLoggedIn();
  const { isMobileSize } = useDisplaySize();

  return (
    <Flex
      direction="column"
      height="100vh"
      pointerEvents={status === 'loading' ? 'none' : 'auto'}
    >
      {/* 상단 네비바 */}
      <Navbar appType={appType} />

      {/* 사이드바 제외한 영역 */}
      <Flex height="100%" overflow="hidden" position="relative">
        {/* 사이드바 영역 */}
        {!isMobileSize && <DesktopMypageSidebar navLinks={navLinks} />}

        {/* 중간 영역 - 메인패널 */}
        <Flex
          direction="column"
          overflow="hidden"
          position="relative"
          flexGrow={1}
          height="100%"
          width="100%"
        >
          {/* 마이페이지 메인 컨텐츠 영역 = 스크롤되는 영역 */}
          <Box
            className="scroll-content"
            maxHeight="inherit"
            overflowY="scroll"
            position="relative"
          >
            {/* 메인컨텐츠 wrapper(푸터제외 영역) */}
            <Box
              className="content-wrapper"
              minHeight={`calc(100vh - ${NAVBAR_HEIGHT}px - ${FOOTER_HEIGHT}px)`}
            >
              <MypageToolbar appType={appType} />
              {children}
            </Box>
            {/* 하단 푸터 */}
            <MypageFooter />
          </Box>
        </Flex>
      </Flex>

      {/* 전체화면 로딩 */}
      {status === 'loading' && <FullscreenLoading />}
      {/* 로그인 필요 다이얼로그 */}
      <LoginRequireAlertDialog isOpen={status === 'error'} />
      {/* 클릭한번에 실시간 상담 버튼 */}
      <FloatingHelpButton />
    </Flex>
  );
}

export default MypageLayout;
