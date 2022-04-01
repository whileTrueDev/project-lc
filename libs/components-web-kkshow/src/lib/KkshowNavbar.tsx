import { Box, Flex, Link, Stack } from '@chakra-ui/react';
import {
  kkshowNavLinks,
  NavItem as NavItemType,
} from '@project-lc/components-constants/navigation';
import { ColorModeSwitcher } from '@project-lc/components-core/ColorModeSwitcher';
import { KksLogo } from '@project-lc/components-shared/KksLogo';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

export function KkshowNavbar(): JSX.Element {
  const navHeight = 120;

  return (
    <Box
      bg="blue.500"
      color="whiteAlpha.900"
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
              <KksLogo variant="white" h={{ base: 30, md: 45 }} />
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
          {/* // TODO: 검색 기능 추가 이후 주석 해제 */}
          {/* <GlobalSearcher /> */}
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
          <NavItem {...navItem} />
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
        color={isMathced ? 'unset' : 'whiteAlpha.800'}
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
