import { CloseIcon, ExternalLinkIcon, HamburgerIcon, Icon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  ButtonProps,
  Container,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Grid,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  useBreakpointValue,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { mainNavItems, NavItem } from '@project-lc/components-constants/navigation';
import { ColorModeSwitcher } from '@project-lc/components-core/ColorModeSwitcher';
import { useDisplaySize, useIsLoggedIn, useLogout, useProfile } from '@project-lc/hooks';
import { UserType } from '@project-lc/shared-types';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo } from 'react';
import { AiTwotoneSetting } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { KksLogo } from './KksLogo';
import ProfileBox from './ProfileBox';
import UserNotificationSection from './UserNotificationSection';

/** 네비바 우측 버튼 공통 스타일 */
export function NavbarRightButton(props: ButtonProps): JSX.Element {
  const { children } = props;
  return (
    <Button variant="unstyled" minW="80px" size="xs" fontSize="1rem" {...props}>
      {children}
    </Button>
  );
}

/** 네비바 우측영역(로그인 여부에 따라 로그인 버튼 혹은 프로필 사진이 표시됨) */
export function NavbarRightButtonSection(): JSX.Element {
  const router = useRouter();
  const { isLoggedIn } = useIsLoggedIn();
  return (
    <Flex alignItems="center" justifyContent="flex-end">
      {isLoggedIn ? (
        // 로그인했을때
        <>
          <Box mr={{ base: '1', sm: '3' }}>
            <UserNotificationSection />
          </Box>

          <PersonalPopoverMenu />
        </>
      ) : (
        // 로그인 안했을때
        <>
          <Box display={{ base: 'none', sm: 'block' }}>
            <ColorModeSwitcher />
          </Box>
          {/* 로그인|회원가입 버튼그룹 컨테이너 */}
          <Flex bg="blue.500" color="white" borderRadius="lg" height="32px" p={1}>
            <NavbarRightButton onClick={() => router.push('/login')}>
              로그인
            </NavbarRightButton>
            <Divider
              display={{ base: 'none', md: 'inline-flex' }}
              orientation="vertical"
            />
            <NavbarRightButton
              onClick={() => router.push('/signup')}
              display={{ base: 'none', md: 'inline-flex' }}
            >
              회원가입
            </NavbarRightButton>
          </Flex>
        </>
      )}
    </Flex>
  );
}

/** 로그인 한 경우에 사용하는 네비바 우측 개인메뉴 팝오버 */
export function PersonalPopoverMenu(): JSX.Element {
  const router = useRouter();
  const { logout } = useLogout();
  const { data: profileData } = useProfile();

  const { colorMode, toggleColorMode } = useColorMode();
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);

  const handleAccountSettingClick = useCallback(
    () => router.push('/mypage/setting'),
    [router],
  );
  return (
    <Menu>
      <MenuButton as={Avatar} size="sm" cursor="pointer" src={profileData?.avatar} />

      <MenuList w={{ base: 280, sm: 300 }}>
        {/* 프로필 표시 */}
        <Box p={3}>
          <ProfileBox allowAvatarChange />
        </Box>
        <Divider />

        {/* 계정설정 버튼 */}
        <MenuItem
          my={1}
          icon={<Icon fontSize="md" as={AiTwotoneSetting} />}
          onClick={handleAccountSettingClick}
        >
          계정 설정
        </MenuItem>

        {/* 다크모드 버튼 */}
        <MenuItem my={1} icon={<SwitchIcon />} onClick={toggleColorMode}>
          {colorMode === 'light' ? '다크모드' : '라이트모드'}
        </MenuItem>

        {/* 알림버튼 - 기존 알림버튼 누를시 팝오버로 알림을 표시했음. 별도 알림페이지 존재하지 않음
        알림을 메뉴에 포함시켰을 때 알림목록 표시할 방법이 떠오르지 않아 개인메뉴에 포함시키지 않음
        */}

        {/* 로그아웃 버튼 */}
        <MenuItem
          my={1}
          icon={<Icon fontSize="md" as={ExternalLinkIcon} />}
          onClick={logout}
        >
          로그아웃
        </MenuItem>
      </MenuList>
    </Menu>
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

export interface NavbarProps {
  appType?: UserType;
}
/** 네비바 레이아웃 */
export function Navbar({ appType = 'seller' }: NavbarProps): JSX.Element {
  const { isOpen, onClose, onToggle } = useDisclosure();

  // 햄버거버튼(모바일화면에서만 표시)
  const hambergerButton = useMemo(() => {
    return (
      <Flex alignItems="center">
        <IconButton
          ml={-2}
          onClick={onToggle}
          icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
          variant="ghost"
          aria-label="Toggle Navigation"
        />
      </Flex>
    );
  }, [isOpen, onToggle]);

  return (
    // {/* 배경이 되는 wrapper 컴포넌트 */}
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      color={useColorModeValue('gray.600', 'white')}
      minH="60px"
      py={{ base: 2 }}
      borderBottom={1}
      borderStyle="solid"
      borderColor={useColorModeValue('gray.200', 'gray.900')}

      // <Box>
      // <Flex
      //   // bg={useColorModeValue('white', 'gray.800')}
      //   color={useColorModeValue('gray.600', 'white')}
      //   minH="60px"
      //   py={{ base: 2 }}
      //   px={{ base: 4 }}
      //   borderBottom={1}
      //   borderStyle="solid"
      //   borderColor={useColorModeValue('gray.200', 'gray.900')}
      //   align="center"
    >
      {/* 최대너비 제한 container */}
      <Container maxW="container.xl">
        {/* 모바일 화면에서 네비바 레이아웃 *******
        로고 가운데 위치시키기 위해 Grid 사용
        display={{ base: 'grid', md: 'none' }}
        */}
        <Grid display={{ base: 'grid', md: 'none' }} templateColumns="repeat(3, 1fr)">
          {hambergerButton}
          <NavbarLinkLogo appType={appType} />
          <NavbarRightButtonSection />
        </Grid>

        {/* 데스크톱 화면에서 네비바 레이아웃 ******
        Flex로 표시 
        display={{ base: 'none', md: 'flex' }}
        */}
        <Flex
          justifyContent="space-between"
          alignItems="center"
          display={{ base: 'none', md: 'flex' }}
        >
          <Flex flex={{ base: 1 }} alignItems="center">
            <NavbarLinkLogo appType={appType} />
            <Box ml={10}>
              <DesktopNav />
            </Box>
          </Flex>
          <NavbarRightButtonSection />
        </Flex>
      </Container>

      <MobileNav isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}

/** 데스크톱 화면에서 네비바 메뉴목록 */
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
              fontSize={{ md: 'md', xl: 'lg' }}
              fontWeight="bold"
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

/** 모바일 화면 네비게이션(좌측 Drawer) */
const MobileNav = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element => {
  const { isLoggedIn } = useIsLoggedIn();
  const router = useRouter();
  const { isMobileSize } = useDisplaySize();

  useEffect(() => {
    if (!isMobileSize) onClose();
  }, [isMobileSize, onClose]);

  return (
    <Drawer isOpen={isOpen} placement="left" size="xs" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent bgGradient="linear(to-r, blue.300, blue.500)" color="white" pt={8}>
        <DrawerCloseButton />

        <DrawerBody>
          <Stack>
            {mainNavItems.map((navItem) => (
              <MobileNavItem key={navItem.label} {...navItem} onClose={onClose} />
            ))}

            {/* 로그인 하지 않은 경우에만 드로어에 회원가입 버튼을 표시한다 */}
            {!isLoggedIn && (
              <Button
                onClick={() => {
                  router.push('/signup');
                  onClose();
                }}
                textAlign="left"
                fontSize="xl"
                fontWeight="bold"
                fontFamily="Gmarket Sans"
                _hover={{ textDecoration: 'underline' }}
                variant="unstyled"
              >
                회원가입
              </Button>
            )}
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

const MobileNavItem = ({
  label,
  href,
  isExternal,
  needLogin,
  onClose,
}: NavItem & { onClose: () => void }): JSX.Element | null => {
  const { isLoggedIn } = useIsLoggedIn();
  const router = useRouter();

  if (needLogin && !isLoggedIn) return null;

  return (
    <Button
      textAlign="left"
      fontSize="xl"
      fontWeight="bold"
      fontFamily="Gmarket Sans"
      _hover={{ textDecoration: 'underline' }}
      variant="unstyled"
      onClick={() => {
        if (isExternal) {
          window.open(href, '_blank');
        } else {
          router.push(href);
        }
        onClose();
      }}
    >
      {label}
    </Button>
  );
};

export const SellerNavbar = (): JSX.Element => <Navbar appType="seller" />;
export const BroadcasterNavbar = (): JSX.Element => <Navbar appType="broadcaster" />;
