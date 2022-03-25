import { Box, Flex, Link, Stack, useColorModeValue } from '@chakra-ui/react';
import { kkshowNavLinks, NavItem } from '@project-lc/components-constants/navigation';
import { ColorModeSwitcher } from '@project-lc/components-core/ColorModeSwitcher';
import { KkshowLogoVariant, KksLogo } from '@project-lc/components-shared/KksLogo';
import NextLink from 'next/link';
import GlobalSearcher from './GlobalSearcher';

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
  const navHeight = 120;

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

  return (
    <Box
      bg={palette.bg}
      color={palette.color}
      pt={{ base: 0, md: 6 }}
      minH={navHeight}
      w="100%"
      zIndex="sticky"
    >
      <Flex
        maxW="5xl"
        m="auto"
        justify="space-between"
        align={{ base: 'center', md: 'end' }}
        minH="60px"
        py={4}
        px={4}
      >
        <Box>
          <NextLink href="/" passHref>
            <Link>
              <KksLogo
                variant={palette.logoVariant as KkshowLogoVariant}
                h={{ base: 30, md: 45 }}
              />
            </Link>
          </NextLink>
        </Box>

        {/* 센터 */}
        <Box flex={1}>
          <Flex alignItems="end" display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav />
          </Flex>
        </Box>

        {/* 우측 */}
        <Flex alignItems="center">
          <ColorModeSwitcher _hover={{}} />
          <GlobalSearcher />
        </Flex>
      </Flex>

      <MobileNav />
    </Box>
  );
}

const DesktopNav = (): JSX.Element => {
  return (
    <Stack direction="row" spacing={4}>
      {kkshowNavLinks.map((navItem) => (
        <Flex key={navItem.label} alignItems="stretch">
          <NextLink href={navItem.href ?? '#'} passHref>
            <Link
              p={2}
              fontSize="lg"
              fontWeight="bold"
              _hover={{ textDecoration: 'none' }}
              isExternal={navItem.isExternal}
            >
              {navItem.label}
            </Link>
          </NextLink>
        </Flex>
      ))}
    </Stack>
  );
};

const MobileNav = (): JSX.Element => {
  return (
    <Flex
      display={{ base: 'flex', md: 'none' }}
      px={4}
      py={2}
      gap={4}
      flexWrap="wrap"
      overflowX="auto"
    >
      {kkshowNavLinks.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Flex>
  );
};

const MobileNavItem = ({ label, href, isExternal }: NavItem): JSX.Element => {
  return (
    <NextLink href={href ?? '#'} passHref>
      <Link
        fontSize={{ base: 'md', sm: 'lg' }}
        fontWeight="bold"
        isExternal={isExternal}
        _hover={{ textDecoration: 'none' }}
      >
        {label}
      </Link>
    </NextLink>
  );
};
export default KkshowNavbar;
