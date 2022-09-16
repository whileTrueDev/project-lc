import { ExternalLinkIcon, Icon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  ButtonProps,
  Divider,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { QuickMenuLink } from '@project-lc/components-constants/quickMenu';
import { ColorModeSwitcher } from '@project-lc/components-core/ColorModeSwitcher';
import {
  useDisplaySize,
  useIsLoggedIn,
  useLogout,
  useProfile,
  useResizedImage,
} from '@project-lc/hooks';
import { useRouter } from 'next/router';
import { AiOutlineSetting } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import ProfileBox from '../ProfileBox';
import UserNotificationMenuButton from '../UserNotificationMenuButton';

/** 네비바 우측 버튼 공통 스타일 */
export function NavbarRightButton(props: ButtonProps): JSX.Element {
  const { children } = props;
  return (
    <Button
      variant="unstyled"
      minW={{ base: '50px', sm: '80px' }}
      size="xs"
      fontSize="1rem"
      _hover={{ bg: 'blue.400' }}
      rounded="lg"
      h="100%"
      {...props}
    >
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
            <UserNotificationMenuButton />
          </Box>

          <PersonalPopoverMenu
            menuItems={[
              {
                name: '계정 설정',
                icon: AiOutlineSetting,
                href: '/mypage/setting',
                type: 'link',
              },
            ]}
          />
        </>
      ) : (
        // 로그인 안했을때
        <>
          <ColorModeSwitcher />
          {/* 로그인|회원가입 버튼그룹 컨테이너 */}
          <Flex bg="blue.500" color="white" rounded="lg" height="32px">
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
export function PersonalPopoverMenu({
  menuItems,
}: {
  menuItems: QuickMenuLink[];
}): JSX.Element {
  const router = useRouter();
  const { logout } = useLogout();
  const { data: profileData } = useProfile();
  const { isMobileSize } = useDisplaySize();
  const { colorMode, toggleColorMode } = useColorMode();
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);
  const resizedImageProps = useResizedImage(profileData?.avatar);
  return (
    <Menu>
      {({ onClose }) => (
        <>
          <MenuButton as={Avatar} size="sm" cursor="pointer" {...resizedImageProps} />

          <Portal>
            <MenuList w={{ base: 280, sm: 300 }} zIndex="popover">
              {/* 프로필 표시 */}
              <Box p={3}>
                <ProfileBox allowAvatarChange onAvatarChangeButtonClick={onClose} />
              </Box>
              <Divider />

              {menuItems.map((menuItem) => (
                <MenuItem
                  key={menuItem.name}
                  my={1}
                  icon={<Icon fontSize="md" as={menuItem.icon} />}
                  onClick={() => {
                    if (menuItem.type === 'link' && !!menuItem.href) {
                      router.push(menuItem.href);
                    }
                  }}
                >
                  {menuItem.name}
                </MenuItem>
              ))}

              {/* 다크모드 버튼 */}
              <MenuItem
                my={1}
                icon={<SwitchIcon />}
                onClick={toggleColorMode}
                closeOnSelect={!!isMobileSize}
              >
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
          </Portal>
        </>
      )}
    </Menu>
  );
}
