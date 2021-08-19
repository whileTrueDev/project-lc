export interface NavItem {
  label: string;
  subLabel?: string;
  // children?: Array<NavItem>;
  href?: string;
  needLogin?: boolean;
}

export const mainNavItems: Array<NavItem> = [
  {
    label: '마이페이지',
    href: '/mypage',
    needLogin: true,
  },
  {
    label: '입점 신청',
  },
  {
    label: '성공 사례',
  },
];

export interface MypageLink {
  name: string;
  href?: string;
  children?: MypageLink[];
}

export const mypageNavLinks: MypageLink[] = [
  { name: '홈', href: '/mypage' },
  {
    name: '상품',
    href: '/mypage/goods',
  },
  {
    name: '라이브쇼핑',
    children: [
      {
        name: '라이브 예약',
        href: '/mypage/live',
      },
      {
        name: 'VOD 관리',
        href: '/mypage/live/vod',
      },
    ],
  },
  {
    name: '주문',
    href: '/mypage/orders',
  },
  {
    name: '상점설정',
    href: '/mypage/shopinfo',
  },
  { name: '정산', href: '/mypage/settlement' },
];
