import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  Stack,
  Button,
} from '@chakra-ui/react';
import {
  mainNavItems,
  mypageNavLinks,
  broadcasterCenterMypageNavLinks,
  NavItem,
} from '@project-lc/components-constants/navigation';
import { useIsLoggedIn, useDisplaySize } from '@project-lc/hooks';
import { UserType } from '@project-lc/shared-types';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import MypageNavbar from '../MypageNavbar';

/** 모바일 화면 네비게이션(좌측 Drawer)
 * @param isOpen drawer 열림 상태를 전달한다 useDisclosure.isOpen
 * @param onClose drawer 닫힐 때 콜백 전달 useDisclosure.onClose
 * @param appType appType 에 따라 판매자, 방송인 마이페이지 네비게이션 링크를 표시함
 */
export const MobileSideDrawerNav = ({
  isOpen,
  onClose,
  appType,
}: {
  isOpen: boolean;
  onClose: () => void;
  appType: UserType;
}): JSX.Element => {
  const { isLoggedIn } = useIsLoggedIn();
  const router = useRouter();
  const { isMobileSize } = useDisplaySize();

  useEffect(() => {
    if (!isMobileSize) onClose();
  }, [isMobileSize, onClose]);

  // 모바일 드로어 네비게이션에서는 메인네비게이션 링크목록 바로 아래 마이페이지 링크 목록이 표시되도록 해놨음
  // 로그인했을때 메인네비게이션-마이페이지버튼이 메인네비게이션 중 가장 아래 있는게 나아보여서 임의로 순서를 바꿨음
  // 이후 메인 네비게이션 링크가 추가되거나 디자인 변경시 바꿔야함 @joni
  const mainNavList: NavItem[] = useMemo(() => {
    if (isLoggedIn) {
      return [...mainNavItems].reverse();
    }
    return mainNavItems;
  }, [isLoggedIn]);

  return (
    <Drawer isOpen={isOpen} placement="left" size="xs" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent bgGradient="linear(to-r, blue.300, blue.500)" color="white" pt={8}>
        <DrawerCloseButton />

        <DrawerBody>
          <Stack>
            {/* 메인 네비게이션 링크 목록 */}
            {mainNavList.map((navItem) => (
              <MobileNavItem key={navItem.label} {...navItem} onClose={onClose} />
            ))}
            {/* 로그인 한 경우 메인 네비게이션 링크 목록 아래에 마이페이지 nav 메뉴를 표시함 */}
            {isLoggedIn && (
              <MypageNavbar
                navLinks={
                  appType === 'seller' ? mypageNavLinks : broadcasterCenterMypageNavLinks
                }
              />
            )}

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

export const MobileNavItem = ({
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
