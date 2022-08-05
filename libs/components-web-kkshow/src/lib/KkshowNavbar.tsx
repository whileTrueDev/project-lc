import {
  Box,
  BoxProps,
  Button,
  Flex,
  Grid,
  GridItem,
  Icon,
  Link,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { quickMenuLinks } from '@project-lc/components-constants/quickMenu';
import { ColorModeSwitcher } from '@project-lc/components-core/ColorModeSwitcher';
import CountBadge from '@project-lc/components-shared/CountBadge';
import { KkshowLogoVariant, KksLogo } from '@project-lc/components-shared/KksLogo';
import { PersonalPopoverMenu } from '@project-lc/components-shared/navbar/NavbarRightButtonSection';
import { useCart, useIsLoggedIn } from '@project-lc/hooks';
import { KkshowNavbarVariant } from '@project-lc/shared-types';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { MdAccountCircle } from 'react-icons/md';
import KkshowSubNavbar from './KkshowSubNavbar';
import { Searcher } from './search-input/Searcher';

export interface KkshowNavbarProps {
  variant?: KkshowNavbarVariant;
  firstLink?: KkshowNavbarLogoProps['first'];
  /** 크크쇼메인네비바에 적용할 boxProps */
  boxProps?: BoxProps;
}
/**
 * @param variant 'blue'인 경우 배경색 파랑, 글자색 흰색 고정인 네비바(메인페이지나 쇼핑탭)
 *                'white'인 경우 라이트모드에서는 배경색 흰색, 글자색 검정
 *                             다크모드에서는 배경 검정, 글자 흰색인 네비바(검색페이지)
 */
export function KkshowNavbar({
  variant = 'blue',
  firstLink = 'kkshow',
  boxProps,
}: KkshowNavbarProps): JSX.Element {
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
    <>
      {/* 메인네비바 Box 컴포넌트 
        (SubNavbar를 position: sticky로 사용하기 위해서는 부모컴포넌트가 KkshowNavbar가 되면 안됨
      그러나 동일한 variant 사용하기 위해 Fragment로 묶음) 
    */}
      <Box
        bg={palette.bg}
        color={palette.color}
        pt={{ base: 0, md: 6 }}
        w="100%"
        zIndex="sticky"
        position="relative" // zIndex 적용하기 위해 설정
        {...boxProps}
      >
        {/* 모바일인 경우 */}
        <Box display={{ base: 'block', md: 'none' }}>
          <Grid
            {...commonNavConatinerStyle}
            templateColumns="repeat(3, 1fr)"
            gap={[2, 4, 6]}
            alignItems="center"
          >
            <GridItem colSpan={2}>
              <KkshowNavbarLogo
                variant={palette.logoVariant as KkshowLogoVariant}
                first={firstLink}
              />
            </GridItem>
            <Flex justifyContent="flex-end">
              <KkshowNavbarRightButtonSection />
            </Flex>
          </Grid>
        </Box>

        {/* 데스크탑인 경우 */}
        <Flex
          display={{ base: 'none', md: 'flex' }}
          {...commonNavConatinerStyle}
          py={4}
          justify="space-between"
        >
          <KkshowNavbarLogo
            variant={palette.logoVariant as KkshowLogoVariant}
            first={firstLink}
          />

          {/* 우측 */}
          <KkshowNavbarRightButtonSection />
        </Flex>
      </Box>
      {/* 서브내비 (링크 모음 섹션) */}
      <KkshowSubNavbar variant={variant} />
    </>
  );
}

interface KkshowNavbarLogoProps {
  variant: KkshowLogoVariant;
  first?: 'kkmarket' | 'kkshow';
}
/** 크크쇼 네비바 로고링크 */
function KkshowNavbarLogo({
  variant,
  first = 'kkshow',
}: KkshowNavbarLogoProps): JSX.Element {
  const logos = useMemo(() => {
    if (first === 'kkmarket')
      return [
        { name: 'kkmarket', href: '/shopping' },
        { name: 'kkshow', href: '/' },
      ];
    return [
      { name: 'kkshow', href: '/' },
      { name: 'kkmarket', href: '/shopping' },
    ];
  }, [first]);
  return (
    <Flex gap={[2, 2, 4]} align="flex-end">
      {logos.map((logo, idx) => (
        <NextLink key={logo.name} href={logo.href} passHref>
          <Link>
            <KksLogo
              appType={logo.name === 'kkmarket' ? 'kkmarket' : undefined}
              variant={variant}
              h={
                idx === logos.length - 1 ? { base: '20px', md: 25 } : { base: 30, md: 45 }
              }
            />
          </Link>
        </NextLink>
      ))}
    </Flex>
  );
}
/** 크크쇼 네비바 우측 버튼모음 */
function KkshowNavbarRightButtonSection(): JSX.Element {
  const { isLoggedIn } = useIsLoggedIn();
  return (
    <Flex gap={2} alignItems="center">
      <Flex>
        <Searcher />
        <Flex display={{ base: 'none', md: 'flex' }}>
          <CartButton />
          {!isLoggedIn && <ColorModeSwitcher _hover={{}} />}
        </Flex>
      </Flex>

      {isLoggedIn ? (
        <PersonalPopoverMenu
          menuItems={[
            {
              icon: MdAccountCircle,
              name: '마이페이지',
              href: '/mypage',
              type: 'link',
            },
          ]}
        />
      ) : (
        <LoginButton />
      )}
    </Flex>
  );
}

export default KkshowNavbar;

export function CartButton(): JSX.Element {
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
      <Button
        px={0}
        variant="unstyle"
        color="current"
        onClick={() => router.push('/login?nextpage=/')}
      >
        로그인
      </Button>
    </Tooltip>
  );
}
