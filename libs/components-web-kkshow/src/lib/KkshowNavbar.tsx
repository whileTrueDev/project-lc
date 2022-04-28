import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Icon,
  Link,
  Stack,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  kkshowNavLinks,
  NavItem as NavItemType,
} from '@project-lc/components-constants/navigation';
import { ColorModeSwitcher } from '@project-lc/components-core/ColorModeSwitcher';
import { KkshowLogoVariant, KksLogo } from '@project-lc/components-shared/KksLogo';
import { useCart, useIsLoggedIn } from '@project-lc/hooks';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { PersonalPopoverMenu } from '@project-lc/components-shared/navbar/NavbarRightButtonSection';
import CountBadge from '@project-lc/components-shared/CountBadge';
import { quickMenuLinks } from '@project-lc/components-constants/quickMenu';
import { Searcher } from './search-input/Searcher';

export const kkshowNavHeight = 120;

type KkshowNavbarVariant = 'blue' | 'white';
interface KkshowNavbar {
  variant?: KkshowNavbarVariant;
}
/**
 * @param variant 'blue'인 경우 배경색 파랑, 글자색 흰색 고정인 네비바(메인페이지나 쇼핑탭)
 *                'white'인 경우 라이트모드에서는 배경색 흰색, 글자색 검정
 *                             다크모드에서는 배경 검정, 글자 흰색인 네비바(검색페이지)
 */
export function KkshowNavbar({ variant = 'blue' }: KkshowNavbar): JSX.Element {
  const palette = {
    bg: useColorModeValue('white', 'gray.800'),
    color: useColorModeValue('gray.700', 'whiteAlpha.900'),
    logoVariant: useColorModeValue('light', 'dark'),
  };

  if (variant === 'blue') {
    palette.bg = 'blue.500';
    palette.color = 'whiteAlpha.900';
    palette.logoVariant = 'white';
  }

  const commonNavConatinerStyle = {
    maxW: '5xl',
    m: 'auto',
    minH: '60px',
    px: 4,
  };

  return (
    <Box
      bg={palette.bg}
      color={palette.color}
      pt={{ base: 0, md: 6 }}
      minH={kkshowNavHeight}
      w="100%"
      zIndex="sticky"
    >
      {/* 모바일인 경우 */}
      <Box display={{ base: 'block', md: 'none' }}>
        <Grid {...commonNavConatinerStyle} templateColumns="repeat(3, 1fr)" gap={6}>
          <Box />
          <Center>
            <KkshowNavbarLogo variant={palette.logoVariant as KkshowLogoVariant} />
          </Center>
          <Flex justifyContent="flex-end">
            <KkshowNavbarRightButtonSection />
          </Flex>
        </Grid>
        <MobileNav />
      </Box>

      {/* 데스크탑인 경우 */}
      <Flex
        display={{ base: 'none', md: 'flex' }}
        {...commonNavConatinerStyle}
        py={4}
        justify="space-between"
      >
        <KkshowNavbarLogo variant={palette.logoVariant as KkshowLogoVariant} />
        {/* 센터 */}
        <Box flex={1}>
          <Flex alignItems="end" ml={10}>
            <DesktopNav />
          </Flex>
        </Box>
        {/* 우측 */}
        <KkshowNavbarRightButtonSection />
      </Flex>
    </Box>
  );
}

/** 크크쇼 네비바 로고링크 */
function KkshowNavbarLogo({ variant }: { variant: KkshowLogoVariant }): JSX.Element {
  return (
    <Box>
      <NextLink href="/" passHref>
        <Link>
          <KksLogo variant={variant} h={{ base: 30, md: 45 }} />
        </Link>
      </NextLink>
    </Box>
  );
}
/** 크크쇼 네비바 우측 버튼모음 */
function KkshowNavbarRightButtonSection(): JSX.Element {
  const { isLoggedIn } = useIsLoggedIn();
  return (
    <Flex alignItems="center">
      {!isLoggedIn && <ColorModeSwitcher _hover={{}} />}
      <Searcher />
      <CartButton />
      {isLoggedIn ? <PersonalPopoverMenu /> : <LoginButton />}
    </Flex>
  );
}

const DesktopNav = (): JSX.Element => {
  return (
    <Stack direction="row" spacing={4}>
      {kkshowNavLinks.map((navItem) => (
        <Flex key={navItem.label} alignItems="stretch">
          <NavItem {...navItem} />
        </Flex>
      ))}
    </Stack>
  );
};

const MobileNav = (): JSX.Element => {
  return (
    <Flex px={4} py={2} gap={4} flexWrap="wrap" overflowX="auto">
      {kkshowNavLinks.map((navItem) => (
        <NavItem key={navItem.label} {...navItem} />
      ))}
    </Flex>
  );
};

const NavItem = ({ label, href, isExternal }: NavItemType): JSX.Element => {
  const router = useRouter();
  const isMathced = useMemo(() => {
    if (href === '/') return router.pathname === href;
    return router.pathname.includes(href);
  }, [href, router.pathname]);
  return (
    <NextLink href={href ?? '#'} passHref>
      <Link
        p={{ base: 0, md: 2 }}
        color={isMathced ? 'unset' : 'inherit'}
        fontWeight="bold"
        fontSize={{ base: 'md', sm: 'lg' }}
        isExternal={isExternal}
        _hover={{ textDecoration: 'none' }}
      >
        {label}
      </Link>
    </NextLink>
  );
};
export default KkshowNavbar;

function CartButton(): JSX.Element {
  const router = useRouter();
  const { data: cartData } = useCart();
  return (
    <Tooltip label="장바구니" fontSize="xs">
      <Button
        w={10}
        h={10}
        variant="unstyle"
        color="current"
        onClick={() => router.push('/cart')}
        position="relative"
        mr={{ base: 1, md: 2 }}
      >
        <CountBadge count={cartData?.length || 0} />
        <Icon
          as={quickMenuLinks.find((link) => link.name === '장바구니')?.icon}
          boxSize={6}
        />
      </Button>
    </Tooltip>
  );
}

function LoginButton(): JSX.Element {
  const router = useRouter();

  return (
    <Tooltip label="로그인하기" fontSize="xs">
      <Button variant="unstyle" color="current" onClick={() => router.push('/login')}>
        로그인
      </Button>
    </Tooltip>
  );
}
