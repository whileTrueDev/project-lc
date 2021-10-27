export interface NavItem {
  label: string;
  subLabel?: string;
  // children?: Array<NavItem>;
  href: string;
  needLogin?: boolean;
}

export const mainNavItems: Array<NavItem> = [
  {
    label: '마이페이지',
    href: '/mypage',
    needLogin: true,
  },
  {
    label: '크크마켓',
    href: '#',
  },
];

export interface MypageLink {
  name: string;
  href: string;
  checkIsActive: (pathname: string, linkHref: string) => boolean;
  children?: MypageLink[];
}

const defaultIsActiveChecker = (pathname: string, linkHref: string): boolean =>
  pathname.includes(linkHref);

export const mypageNavLinks: MypageLink[] = [
  {
    name: '홈',
    href: '/mypage',
    checkIsActive: (pathname, linkHref) => pathname === linkHref,
  },
  {
    name: '상품',
    href: '/mypage/goods',
    checkIsActive: defaultIsActiveChecker,
  },
  {
    name: '라이브쇼핑',
    href: '/mypage/live',
    checkIsActive: defaultIsActiveChecker,
    children: [
      {
        name: '내 라이브 쇼핑 관리',
        href: '/mypage/live',
        checkIsActive: defaultIsActiveChecker,
      },
      // {
      //   name: 'VOD 관리',
      //   href: '/mypage/live/vod',
      //   checkIsActive: defaultIsActiveChecker,
      // },
    ],
  },
  {
    name: '주문',
    href: '/mypage/orders',
    checkIsActive: defaultIsActiveChecker,
  },
  {
    name: '상점설정',
    href: '/mypage/shopinfo',
    checkIsActive: defaultIsActiveChecker,
  },
  {
    name: '정산',
    href: '/mypage/settlement',
    checkIsActive: defaultIsActiveChecker,
  },
];
