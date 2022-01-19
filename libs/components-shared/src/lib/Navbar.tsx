import {
  Box,
  Flex,
  Grid,
  Link,
  Stack,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { mainNavItems } from '@project-lc/components-constants/navigation';
import { useDisplaySize, useIsLoggedIn } from '@project-lc/hooks';
import { UserType } from '@project-lc/shared-types';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import { KksLogo } from './KksLogo';
import { MobileSideDrawerNav } from './navbar/MobileSideDrawerNav';
import { NavbarRightButtonSection } from './navbar/NavbarRightButtonSection';
import { NavbarToggleButton } from './navbar/NavbarToggleButton';

export interface NavbarProps {
  appType?: UserType;
  desktopSidebarToggleButton?: JSX.Element;
}
/** 네비바 레이아웃 */
export function Navbar({
  appType = 'seller',
  desktopSidebarToggleButton,
}: NavbarProps): JSX.Element {
  const { isOpen, onClose, onToggle } = useDisclosure();
  const { isMobileSize } = useDisplaySize();

  // 햄버거버튼(모바일화면에서만 표시)
  const hambergerButton = useMemo(() => {
    return (
      <Flex alignItems="center">
        <NavbarToggleButton onToggle={onToggle} isOpen={isOpen} />
      </Flex>
    );
  }, [isOpen, onToggle]);

  return (
    // {/* Navbar 배경이 되는 wrapper 컴포넌트 */}
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      color={useColorModeValue('gray.600', 'white')}
      minH="60px"
      width="100%"
      py={{ base: 2 }}
      px={{ base: 4 }}
      borderBottom={1}
      borderStyle="solid"
      borderColor={useColorModeValue('gray.200', 'gray.900')}
    >
      {isMobileSize ? (
        <MobileNavLayout>
          {hambergerButton}
          <NavbarLinkLogo appType={appType} />
          <NavbarRightButtonSection />
        </MobileNavLayout>
      ) : (
        <DesktopNavLayout>
          <Flex gap={2} flex={{ base: 1 }} alignItems="center">
            {desktopSidebarToggleButton}
            <NavbarLinkLogo appType={appType} />
            <Box ml={10}>
              <MainNavItemList />
            </Box>
          </Flex>
          <NavbarRightButtonSection />
        </DesktopNavLayout>
      )}

      {/* 토글버튼(hambergerButton)으로 여닫는 모바일화면 네비바(Drawer) */}
      <MobileSideDrawerNav isOpen={isOpen} onClose={onClose} appType={appType} />
    </Box>
  );
}

/** 네비바에 사용하는 크크쇼 로고(링크) */
export function NavbarLinkLogo({ appType }: { appType: UserType }): JSX.Element {
  return (
    <NextLink href="/" passHref>
      <Link
        textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
        color={useColorModeValue('gray.800', 'white')}
      >
        <KksLogo appType={appType} size="small" />
      </Link>
    </NextLink>
  );
}

/**  모바일 화면에서 네비바 레이아웃 ******* 로고 가운데 위치시키기 위해 Grid 사용 */
function MobileNavLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return <Grid templateColumns="repeat(3, 1fr)">{children}</Grid>;
}

/** 데스크톱 화면에서 네비바 레이아웃 ****** Flex로 표시 */
function DesktopNavLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <Flex justifyContent="space-between" alignItems="center">
      {children}
    </Flex>
  );
}

/** 데스크톱 화면에서 네비바 메뉴목록 */
const MainNavItemList = (): JSX.Element => {
  const router = useRouter();
  const linkColor = useColorModeValue('gray.900', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.600', 'blue.100');
  const { isLoggedIn } = useIsLoggedIn();

  // 로그인 여부에 따라, 로그인이 필요한 링크만 보여지도록 처리하기 위함
  const realMainNavItems = !isLoggedIn
    ? mainNavItems.filter((i) => !i.needLogin)
    : mainNavItems;

  const isMatched = useCallback(
    (href: string) => {
      return router.pathname.includes(href);
    },
    [router.pathname],
  );

  return (
    <Stack direction="row" spacing={4}>
      {realMainNavItems.map((navItem) => (
        <Box key={navItem.label}>
          <NextLink href={navItem.href ?? '#'} passHref>
            <Link
              p={2}
              fontSize={{ md: 'md', xl: 'lg' }}
              fontWeight="bold"
              color={linkColor}
              _hover={{
                textDecoration: 'none',
                color: linkHoverColor,
              }}
              textDecoration={isMatched(navItem.href) ? 'underline' : 'none'}
              textDecorationColor={isMatched(navItem.href) ? 'blue.400' : 'none'}
              textDecorationThickness={isMatched(navItem.href) ? '0.225rem' : 'none'}
              isExternal={navItem.isExternal}
            >
              {navItem.label}
            </Link>
          </NextLink>
        </Box>
      ))}
    </Stack>
  );
};

export const SellerNavbar = (): JSX.Element => <Navbar appType="seller" />;
export const BroadcasterNavbar = (): JSX.Element => <Navbar appType="broadcaster" />;
