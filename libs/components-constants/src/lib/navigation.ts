import {
  FcMoneyTransfer,
  FcInspection,
  FcList,
  FcDislike,
  FcOnlineSupport,
  FcSms,
  FcAdvertising,
} from 'react-icons/fc';

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

export const kkshowNavLinks: Array<NavItem> = [
  {
    label: '크크마켓',
    href: 'https://k-kmarket.com/',
    isExternal: true,
  },
  // { label: '방송편성표', href: '/' },
  // { label: '방송인', href: '/' },
  // { label: 'SNS', href: '/' },
];

// ************************************************
// 마이페이지 네비
// ************************************************

export interface LinkItemProps {
  name: string;
  href: string;
}

export interface SidebarMenuLink extends LinkItemProps {
  children?: SidebarMenuLink[];
  icon?: any;
}

export interface MypageLink extends LinkItemProps {
  children?: MypageLink[];
  checkIsActive: (pathname: string, linkHref: string) => boolean;
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

/** 관리자 페이지 상단 네비바 링크 */
export const adminNavItems: Array<NavItem> = [
  {
    label: '크크마켓',
    href: 'https://k-kmarket.com/',
    isExternal: true,
  },
];

/** 관리자 페이지 사이드바 - 관리메뉴 링크 */
export const adminSidebarMenuList: SidebarMenuLink[] = [
  {
    name: '방송인',
    href: '/broadcaster',
    children: [
      { name: '정산정보 검수', href: '/broadcaster/settlement-info', icon: FcInspection },
      { name: '정산', href: '/broadcaster/settlement', icon: FcMoneyTransfer },
    ],
  },
  {
    name: '판매자',
    href: '/seller',
    children: [
      { name: '계좌정보 목록', href: '/seller/account', icon: FcList },
      {
        name: '사업자 등록정보 검수',
        href: '/seller/business-registration',
        icon: FcInspection,
      },
      { name: '정산', href: '/seller/settlement', icon: FcMoneyTransfer },
    ],
  },
  {
    name: '상품',
    href: '/goods',
    children: [{ name: '상품검수', href: '/goods/confirmation', icon: FcInspection }],
  },
  {
    name: '라이브쇼핑',
    href: '/live-shopping',
  },
  {
    name: '주문',
    href: 'order',
    children: [{ name: '결제취소 요청', href: '/order/order-cancel', icon: FcDislike }],
  },
  {
    name: '일반관리',
    href: '/general',
    children: [
      { name: '문의하기', href: '/general/inquiry', icon: FcOnlineSupport },
      { name: '알림메시지', href: '/general/notification', icon: FcSms },
      { name: '공지사항', href: '/general/notice', icon: FcAdvertising },
    ],
  },
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
