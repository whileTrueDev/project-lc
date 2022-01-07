import { CloseIcon, ExternalLinkIcon, HamburgerIcon, Icon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { mainNavItems, NavItem } from '@project-lc/components-constants/navigation';
import { ColorModeSwitcher } from '@project-lc/components-core/ColorModeSwitcher';
import { useIsLoggedIn, useLogout, useProfile } from '@project-lc/hooks';
import { UserType } from '@project-lc/shared-types';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { AiTwotoneSetting } from 'react-icons/ai';
import { KksLogo } from './KksLogo';
import ProfileBox from './ProfileBox';
import UserNotificationSection from './UserNotificationSection';

export interface NavbarProps {
  appType?: UserType;
}
export function Navbar({ appType = 'seller' }: NavbarProps): JSX.Element {
  const router = useRouter();
  const { isOpen, onToggle } = useDisclosure();
  const { isLoggedIn } = useIsLoggedIn();
  const { logout } = useLogout();
  const { data: profileData } = useProfile();

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
        <Flex flex={{ base: 1 }} justify={{ md: 'start' }} alignItems="center">
          <NextLink href="/" passHref>
            <Link
              textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
              color={useColorModeValue('gray.800', 'white')}
            >
              <KksLogo appType={appType} size="small" />
            </Link>
          </NextLink>
          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Flex alignItems="center">
          <ColorModeSwitcher />
          {isLoggedIn ? (
            <>
              <Box mr={{ base: '1', sm: '3' }}>
                <UserNotificationSection />
              </Box>

              <Menu>
                <MenuButton
                  as={Avatar}
                  size="sm"
                  cursor="pointer"
                  src={profileData?.avatar}
                />
                <MenuList w={{ base: 280, sm: 300 }}>
                  <Box p={3}>
                    <ProfileBox allowAvatarChange />
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
                mr={{ base: '1', sm: '3' }}
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
        </Flex>
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

export const SellerNavbar = (): JSX.Element => <Navbar appType="seller" />;
export const BroadcasterNavbar = (): JSX.Element => <Navbar appType="broadcaster" />;
