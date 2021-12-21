export interface NavItem {
  label: string;
  subLabel?: string;
  // children?: Array<NavItem>;
  href: string;
  needLogin?: boolean;
  isExternal?: boolean;
}

export const mainNavItems: Array<NavItem> = [
  {
    label: '마이페이지',
    href: '/mypage',
    needLogin: true,
  },
  {
    label: '크크마켓',
    href: 'https://k-kmarket.com/',
    isExternal: true,
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

export const adminNavItems: Array<NavItem> = [
  {
    label: '정산정보관리',
    href: '/admin',
  },
  {
    label: '회차별 정산처리',
    href: '/settlement',
  },
  {
    label: '상품검수',
    href: '/goods',
  },
  {
    label: '라이브쇼핑관리',
    href: '/live-shopping',
  },
  {
    label: '공지사항',
    href: '/notice',
  },
  { label: '결제 취소 요청', href: '/order-cancel' },
  { label: '알림메시지 보내기', href: '/notification' },
  { label: '문의하기 관리', href: '/inquiry' },
];

export const broadcasterCenterMypageNavLinks: Array<MypageLink> = [
  {
    name: '홈',
    href: '/mypage',
    checkIsActive: (pathname, linkHref) => pathname === linkHref,
  },
  {
    name: '라이브쇼핑',
    href: '/mypage/live',
    checkIsActive: defaultIsActiveChecker,
  },
  {
    name: '구입현황',
    href: '/mypage/purchase',
    checkIsActive: defaultIsActiveChecker,
  },
  {
    name: '정산',
    href: '/mypage/settlement',
    checkIsActive: defaultIsActiveChecker,
  },
  {
    name: '계정설정',
    href: '/mypage/setting',
    checkIsActive: defaultIsActiveChecker,
  },
];
