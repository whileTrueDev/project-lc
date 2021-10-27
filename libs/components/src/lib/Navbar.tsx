import { CloseIcon, ExternalLinkIcon, HamburgerIcon, Icon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  Heading,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Tooltip,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useIsLoggedIn, useLogout } from '@project-lc/hooks';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { AiTwotoneSetting } from 'react-icons/ai';
import { mainNavItems, NavItem } from '../constants/navigation';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import ProfileBox from './ProfileBox';
import KksLogo from './KksLogo';

export function Navbar(): JSX.Element {
  const router = useRouter();
  const { isOpen, onToggle } = useDisclosure();
  const { isLoggedIn } = useIsLoggedIn();
  const { logout } = useLogout();

  const handleAccountSettingClick = useCallback(
    () => router.push('/mypage/setting'),
    [router],
  );

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH="60px"
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle="solid"
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align="center"
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant="ghost"
            aria-label="Toggle Navigation"
          />
        </Flex>
        <Flex
          flex={{ base: 1 }}
          justify={{ base: 'center', md: 'start' }}
          alignItems="center"
        >
          <Heading fontSize="md">
            <NextLink href="/" passHref>
              <Link
                textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
                color={useColorModeValue('gray.800', 'white')}
              >
                <KksLogo size="small" />
              </Link>
            </NextLink>
          </Heading>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify="flex-end"
          alignItems="center"
          direction="row"
          spacing={{ base: 0, sm: 4 }}
        >
          <ColorModeSwitcher />
          {isLoggedIn ? (
            <>
              <Tooltip label="계정 설정" fontSize="xs">
                <IconButton
                  size="md"
                  fontSize="xl"
                  variant="ghost"
                  color="current"
                  aria-label="settings icon"
                  icon={<AiTwotoneSetting />}
                  onClick={handleAccountSettingClick}
                />
              </Tooltip>
              <Menu>
                <MenuButton as={Avatar} size="sm" cursor="pointer" />
                <MenuList w={{ base: 280, sm: 300 }}>
                  <Box p={3}>
                    <ProfileBox />
                  </Box>
                  <Divider />
                  <MenuItem
                    my={1}
                    icon={<Icon fontSize="md" as={AiTwotoneSetting} />}
                    onClick={handleAccountSettingClick}
                  >
                    계정 설정
                  </MenuItem>
                  <MenuItem
                    my={1}
                    icon={<Icon fontSize="md" as={ExternalLinkIcon} />}
                    onClick={logout}
                  >
                    로그아웃
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <>
              <Button
                as="a"
                fontSize="sm"
                fontWeight={500}
                variant="link"
                onClick={() => router.push('/login')}
              >
                로그인
              </Button>
              <Button
                onClick={() => router.push('/signup')}
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize="sm"
                fontWeight={600}
                color="white"
                bg="pink.400"
                _hover={{ bg: 'pink.300' }}
              >
                회원가입
              </Button>
            </>
          )}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = (): JSX.Element => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  const { isLoggedIn } = useIsLoggedIn();

  // 로그인 여부에 따라, 로그인이 필요한 링크만 보여지도록 처리하기 위함
  const realMainNavItems = !isLoggedIn
    ? mainNavItems.filter((i) => !i.needLogin)
    : mainNavItems;

  return (
    <Stack direction="row" spacing={4}>
      {realMainNavItems.map((navItem) => (
        <Box key={navItem.label}>
          <NextLink href={navItem.href ?? '#'} passHref>
            <Link
              p={2}
              fontSize="sm"
              fontWeight={500}
              color={linkColor}
              _hover={{
                textDecoration: 'none',
                color: linkHoverColor,
              }}
            >
              {navItem.label}
            </Link>
          </NextLink>
        </Box>
      ))}
    </Stack>
  );
};

const MobileNav = (): JSX.Element => {
  return (
    <Stack bg={useColorModeValue('white', 'gray.800')} p={4} display={{ md: 'none' }}>
      {mainNavItems.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, href, needLogin }: NavItem): JSX.Element => {
  const navItemTextColor = useColorModeValue('gray.600', 'gray.200');
  const { isLoggedIn } = useIsLoggedIn();

  if (needLogin) {
    return (
      <Flex
        py={1}
        justify="space-between"
        align="center"
        _hover={{ textDecoration: 'none' }}
        display={isLoggedIn ? 'flex' : 'none'}
      >
        <NextLink href={href ?? '#'} passHref>
          <Link fontSize="sm" fontWeight={500} color={navItemTextColor}>
            {label}
          </Link>
        </NextLink>
      </Flex>
    );
  }

  return (
    <Flex
      py={1}
      justify="space-between"
      align="center"
      _hover={{ textDecoration: 'none' }}
    >
      <NextLink href={href ?? '#'} passHref>
        <Link fontSize="sm" fontWeight={500} color={navItemTextColor}>
          {label}
        </Link>
      </NextLink>
    </Flex>
  );
};
