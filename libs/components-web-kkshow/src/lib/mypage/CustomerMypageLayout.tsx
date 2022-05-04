import { Box, Flex, Stack } from '@chakra-ui/react';
import { useIsLoggedIn } from '@project-lc/hooks';
import LoginRequireAlertDialog from '@project-lc/components-core/LoginRequireAlertDialog';
import BottomQuickMenu from '@project-lc/components-shared/BottomQuickMenu';
import { KkshowNavbar } from '../KkshowNavbar';
import { CustomerMypageDesktopSidebar } from './CustomerMypageSidebar';

export interface KkshowCustomerMypageLayoutProps {
  children?: React.ReactNode;
}
export function CustomerMypageLayout({
  children,
}: KkshowCustomerMypageLayoutProps): JSX.Element {
  const { status } = useIsLoggedIn();
  return (
    <Stack
      height="100vh"
      spacing={0}
      pointerEvents={status === 'loading' ? 'none' : 'auto'}
    >
      <KkshowNavbar variant="white" />
      <Flex height="100%" overflow="hidden" position="relative">
        {/* 데스크탑 화면일 때 표시하는 마이페이지 사이드바 */}
        <Box
          minWidth="200px"
          height="100%"
          overflowY="auto"
          display={{ base: 'none', md: 'block' }}
        >
          <CustomerMypageDesktopSidebar />
        </Box>
        {/* 모바일 화면일때 마이페이지 사이드바는 마이페이지 홈에서 표시 (하단퀵메뉴 마이페이지 누르면 마이페이지 홈으로 이동) */}
        <Box flexGrow={1} height="100%" overflowY="auto">
          <Box minHeight="100%">{children}</Box>
        </Box>
      </Flex>

      {/* 로그인 필요 다이얼로그 */}
      <LoginRequireAlertDialog isOpen={status === 'error'} />
      {/* 하단 퀵메뉴 */}
      <BottomQuickMenu />
    </Stack>
  );
}

export default CustomerMypageLayout;
