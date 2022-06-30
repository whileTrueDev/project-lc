import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import LoginRequireAlertDialog from '@project-lc/components-core/LoginRequireAlertDialog';
import BottomQuickMenu from '@project-lc/components-shared/BottomQuickMenu';
import { useIsLoggedIn } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import { KkshowNavbar } from '../KkshowNavbar';
import { CustomerMypageDesktopSidebar } from './CustomerMypageSidebar';
import { CustomerStatusSection } from './CustomerStatusSection';

export interface KkshowCustomerMypageLayoutProps {
  children?: React.ReactNode;
  enableCustomerStatusOnMobile?: boolean;
  title?: string;
}
export function CustomerMypageLayout({
  children,
  enableCustomerStatusOnMobile = false,
  title,
}: KkshowCustomerMypageLayoutProps): JSX.Element {
  const { status } = useIsLoggedIn();
  return (
    <Stack
      height="100vh"
      spacing={0}
      pointerEvents={status === 'loading' ? 'none' : 'auto'}
    >
      <KkshowNavbar variant="white" />
      <Box>
        {title && <MobileNavSection title={title} />}
        {enableCustomerStatusOnMobile && (
          <CustomerStatusSection mobileVisibility={enableCustomerStatusOnMobile} />
        )}
        <Flex
          height="100%"
          overflow="hidden"
          position="relative"
          m="auto"
          maxW="5xl"
          w="100%"
        >
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
      </Box>

      {/* 로그인 필요 다이얼로그 */}
      <LoginRequireAlertDialog isOpen={status === 'error'} />
      {/* 하단 퀵메뉴 */}
      <BottomQuickMenu />
    </Stack>
  );
}

export default CustomerMypageLayout;

interface MobileNavSectionProps {
  title: string;
}
function MobileNavSection({ title }: MobileNavSectionProps): JSX.Element {
  const bgColor = useColorModeValue('white', 'gray.900');
  const router = useRouter();
  return (
    <Flex
      display={{ base: 'flex', md: 'none' }}
      bgColor={bgColor}
      position="sticky"
      top={0}
      alignItems="center"
      justify="center"
      zIndex="sticky"
      minH="50px"
    >
      <Box position="absolute" left={0}>
        <IconButton
          aria-label="backbutton"
          variant="unstyled"
          size="lg"
          onClick={() => router.back()}
        >
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <Text fontWeight="bold">{title}</Text>
    </Flex>
  );
}
