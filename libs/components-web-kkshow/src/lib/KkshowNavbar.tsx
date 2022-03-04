import { Box, Flex, Link, Stack } from '@chakra-ui/react';
import { kkshowNavLinks, NavItem } from '@project-lc/components-constants/navigation';
import { ColorModeSwitcher } from '@project-lc/components-core/ColorModeSwitcher';
import { KksLogo } from '@project-lc/components-shared/KksLogo';
import NextLink from 'next/link';

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
              <KksLogo variant="white" h={{ base: 30, md: 50 }} />
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
