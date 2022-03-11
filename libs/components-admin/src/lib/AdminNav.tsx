import { Box, Button, Flex, Link, useColorModeValue, Text } from '@chakra-ui/react';
import { adminNavItems } from '@project-lc/components-constants/navigation';
import { ColorModeSwitcher } from '@project-lc/components-core/ColorModeSwitcher';
import { useIsLoggedIn, useLogout, useProfile } from '@project-lc/hooks';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { AdminClassBadge } from './AdminClassBadge';

export function AdminDesktopNav(): JSX.Element {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  return (
    <Flex display={{ base: 'none', md: 'flex' }} ml={4}>
      {adminNavItems.map((adminNav) => (
        <Box key={adminNav.label}>
          <NextLink href={adminNav.href ?? '#'} passHref>
            <Link
              p={2}
              fontSize="sm"
              fontWeight={500}
              color={linkColor}
              _hover={{
                textDecoration: 'none',
                color: linkHoverColor,
              }}
              isExternal={adminNav.isExternal}
            >
              {adminNav.label}
            </Link>
          </NextLink>
        </Box>
      ))}
    </Flex>
  );
}

export function AdminLogOutButton(): JSX.Element | null {
  const router = useRouter();
  const { isLoggedIn } = useIsLoggedIn();
  const { logout } = useLogout();
  const adminLogout = (): void => {
    logout();
    router.push('/');
  };

  if (!isLoggedIn) return null;
  return (
    <Button my={1} size="sm" onClick={adminLogout}>
      로그아웃
    </Button>
  );
}

export function AdminMainLinkButton(): JSX.Element {
  return (
    <NextLink href="/admin" passHref>
      <Link
        color={useColorModeValue('blue.500', 'blue.100')}
        wordBreak="keep-all"
        fontSize="lg"
        fontWeight="extrabold"
      >
        크크쇼 관리자 페이지
      </Link>
    </NextLink>
  );
}

/** 로그인한 관리자 프로필 표시 - 이메일/접근가능 권한 표시 */
export function AdminProfile(): JSX.Element | null {
  const { data: profileData, isLoading } = useProfile();
  if (!isLoading && profileData) {
    return (
      <Box>
        <AdminClassBadge adminClass={profileData.adminClass} />
        <Text>{profileData.email}</Text>
      </Box>
    );
  }

  return null;
}

export function AdminNav({
  toggleButton,
}: {
  toggleButton?: JSX.Element | null;
}): JSX.Element {
  return (
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
      justify="flex-start"
    >
      {/* 사이드바 토글버튼(사이드바 닫혀있는경우만 보임) */}
      {toggleButton}
      {/* 로고 - 없어서 그냥 메인으로 이동하는 링크 */}
      <AdminMainLinkButton />

      {/* 네비바 - 링크 */}
      <AdminDesktopNav />

      {/* 네비바 우측 메뉴 */}
      <Flex alignItems="center" ml="auto">
        {/* 로그인한 관리자 이메일 표시 */}
        <AdminProfile />
        {/* 다크모드 토글버튼 */}
        <ColorModeSwitcher />
        {/* 로그아웃 버튼( AdminPageLayout 로그인 안되어있으면 로그인 페이지로 이동하는 훅 적용되어있어서 로그인버튼은 없음) */}
        <AdminLogOutButton />
      </Flex>
    </Flex>
  );
}
