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
    children: [
      {
        name: '상품목록',
        href: '/mypage/goods',
      },
    ],
  },
  {
    name: '주문',
    children: [
      {
        name: '주문목록',
        href: '/mypage/orders',
      },
    ],
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
  { name: '배송정책', href: '/mypage/delivery' },
  { name: '정산', href: '/mypage/settlement' },
];
