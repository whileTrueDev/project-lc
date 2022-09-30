import {
  AiOutlineContainer,
  AiOutlineHome,
  AiOutlineSetting,
  AiOutlineShop,
} from 'react-icons/ai';
import { BsBox } from 'react-icons/bs';
import {
  FcAdvertising,
  FcBiohazard,
  FcBusinessman,
  FcCloseUpMode,
  FcFaq,
  FcFinePrint,
  FcIdea,
  FcInspection,
  FcLink,
  FcList,
  FcMoneyTransfer,
  FcQuestions,
  FcRating,
  FcSms,
  FcVideoCall,
} from 'react-icons/fc';
import { IconType } from 'react-icons/lib';
import {
  MdAccountCircle,
  MdLiveTv,
  MdOutlineLiveTv,
  MdOutlineShoppingCart,
  MdPayment,
  MdShoppingBasket,
} from 'react-icons/md';
import { RiFootprintFill } from 'react-icons/ri';

export interface NavItem {
  label: string;
  subLabel?: string;
  // children?: Array<NavItem>;
  href: string;
  needLogin?: boolean;
  isExternal?: boolean;
}

/** 방송인센터, 판매자센터 상단 네비바 링크 */
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

// ************************************************
// 마이페이지 네비
// ************************************************

export interface LinkItemProps {
  name: string;
  href: string;
  icon?: IconType;
}

export interface SidebarMenuLink extends LinkItemProps {
  children?: SidebarMenuLink[];
}

export interface MypageLink extends LinkItemProps {
  children?: Omit<MypageLink, 'icon'>[];
  checkIsActive: (pathname: string, linkHref: string) => boolean;
  isInvisible?: boolean;
}

const defaultIsActiveChecker = (pathname: string, linkHref: string): boolean =>
  pathname.includes(linkHref);

/** 판매자 마이페이지 링크 */
export const mypageNavLinks: MypageLink[] = [
  {
    icon: AiOutlineHome,
    name: '홈',
    href: '/mypage',
    checkIsActive: (pathname, linkHref) => pathname === linkHref,
  },
  {
    icon: BsBox,
    name: '상품',
    href: '/mypage/goods',
    checkIsActive: defaultIsActiveChecker,
    children: [
      {
        name: '상품 목록',
        href: '/mypage/goods',
        checkIsActive: (pathname, linkHref) => pathname === linkHref,
      },
      {
        name: '문의 관리',
        href: '/mypage/goods-inquiries',
        checkIsActive: (pathname, linkHref) => pathname === linkHref,
      },
      {
        name: '상품 후기 관리',
        href: '/mypage/goods-reviews',
        checkIsActive: (pathname, linkHref) => pathname === linkHref,
      },
    ],
  },
  {
    icon: MdLiveTv,
    name: '라이브쇼핑',
    href: '/mypage/live',
    checkIsActive: defaultIsActiveChecker,
    // children: [
    // {
    //   name: '내 라이브 쇼핑 관리',
    //   href: '/mypage/live',
    //   checkIsActive: (pathname, linkHref) => pathname === linkHref,
    // },
    // {
    //   name: 'VOD 관리',
    //   href: '/mypage/live/vod',
    //   checkIsActive: (pathname, linkHref) => pathname === linkHref,
    // },
    // ],
  },
  {
    icon: MdOutlineShoppingCart,
    name: '주문',
    href: '/mypage/orders',
    checkIsActive: defaultIsActiveChecker,
  },
  {
    icon: MdPayment,
    name: '정산',
    href: '/mypage/settlement',
    checkIsActive: defaultIsActiveChecker,
  },
  {
    icon: AiOutlineContainer,
    name: '이용안내',
    href: '/mypage/manual',
    checkIsActive: defaultIsActiveChecker,
  },
  {
    icon: AiOutlineShop,
    name: '상점설정',
    href: '/mypage/shopinfo',
    checkIsActive: defaultIsActiveChecker,
  },
  {
    icon: AiOutlineSetting,
    name: '계정설정',
    href: '/mypage/setting',
    checkIsActive: defaultIsActiveChecker,
  },
  {
    name: '등록',
    href: 'regist',
    isInvisible: true,
    checkIsActive: defaultIsActiveChecker,
  },
  {
    name: '수정',
    href: 'edit',
    isInvisible: true,
    checkIsActive: defaultIsActiveChecker,
  },
  {
    name: '출고',
    href: 'exports',
    isInvisible: true,
    checkIsActive: defaultIsActiveChecker,
  },
  {
    name: '알림',
    href: 'notifications',
    isInvisible: true,
    checkIsActive: defaultIsActiveChecker,
  },
];

export const broadcasterCenterMypageNavLinks: Array<MypageLink> = [
  {
    icon: AiOutlineHome,
    name: '홈',
    href: '/mypage',
    checkIsActive: (pathname, linkHref) => pathname === linkHref,
  },
  {
    icon: MdLiveTv,
    name: '라이브쇼핑',
    href: '/mypage/live',
    checkIsActive: defaultIsActiveChecker,
  },
  {
    icon: MdOutlineShoppingCart,
    name: '구입현황',
    href: '/mypage/purchase',
    checkIsActive: defaultIsActiveChecker,
  },
  {
    icon: MdPayment,
    name: '정산',
    href: '/mypage/settlement',
    checkIsActive: defaultIsActiveChecker,
  },
  {
    icon: AiOutlineContainer,
    name: '이용안내',
    href: '/mypage/manual',
    checkIsActive: defaultIsActiveChecker,
  },
  {
    icon: AiOutlineSetting,
    name: '계정설정',
    href: '/mypage/setting',
    checkIsActive: defaultIsActiveChecker,
  },
  {
    name: '알림',
    href: 'notifications',
    isInvisible: true,
    checkIsActive: defaultIsActiveChecker,
  },
];

/** 관리자 페이지 상단 네비바 링크 */
export const adminNavItems: Array<NavItem> = [
  {
    label: '크크쇼',
    href: 'https://크크쇼.com/',
    isExternal: true,
  },
];

/** 관리자 페이지 사이드바 - 관리메뉴 링크 */
export const adminSidebarMenuList: SidebarMenuLink[] = [
  {
    name: '방송인',
    href: '/broadcaster',
    children: [
      { name: '가입자 목록', href: '/broadcaster/signup-list', icon: FcBusinessman },
      { name: '정산정보 검수', href: '/broadcaster/settlement-info', icon: FcInspection },
      { name: '정산', href: '/broadcaster/settlement', icon: FcMoneyTransfer },
      {
        name: '상품 홍보 페이지',
        href: '/broadcaster/promotion-page',
        icon: FcList,
      },
    ],
  },
  {
    name: '판매자',
    href: '/seller',
    children: [
      { name: '가입자 목록', href: '/seller/signup-list', icon: FcBusinessman },
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
    name: '구매자',
    href: '/customer',
    children: [
      { name: '쿠폰관리', href: '/customer/coupon', icon: FcFinePrint },
      { name: '마일리지 관리', href: '/customer/mileage', icon: FcMoneyTransfer },
      { name: '가입자 목록', href: '/customer/signup-list', icon: FcBusinessman },
    ],
  },
  {
    name: '상품',
    href: '/goods',
    children: [
      { name: '상품목록/검수', href: '/goods/confirmation', icon: FcInspection },
      { name: '상품카테고리', href: '/goods/category', icon: FcList },
      { name: '상품문의관리', href: '/goods/inquiry', icon: FcQuestions },
      { name: '상품리뷰관리', href: '/goods/review', icon: FcRating },
    ],
  },
  {
    name: '라이브쇼핑',
    href: '/live-shopping',
    children: [
      { name: '라이브 쇼핑 목록', href: '/live-shopping', icon: FcVideoCall },
      { name: '오버레이 테마', href: '/overlay-theme', icon: FcList },
    ],
  },
  {
    name: '주문',
    href: 'order',
    children: [
      // { name: '결제취소 요청', href: '/order/order-cancel', icon: FcDislike }, // 220916 기준. 판매자의 결제취소요청 기능은 사용하지 않아서(퍼스트몰db랑 연동해서 사용하던 때 필요했던 기능) 주석처리함
      { name: '주문 목록', href: '/order/list', icon: FcList },
      { name: '출고 목록', href: '/order/exports', icon: FcList },
      { name: '환불요청 처리', href: '/order/refund', icon: FcMoneyTransfer },
      { name: '마일리지 설정', href: '/order/mileage-setting', icon: FcRating },
    ],
  },
  {
    name: '일반관리',
    href: '/general',
    children: [
      { name: '문의하기', href: '/general/inquiry', icon: FcFaq },
      { name: '알림메시지', href: '/general/notification', icon: FcSms },
      { name: '공지사항', href: '/general/notice', icon: FcAdvertising },
      {
        name: '이용정책, 개인정보처리방침',
        href: '/general/policy',
        icon: FcList,
      },
      {
        name: '이용안내',
        href: '/general/manual',
        icon: FcCloseUpMode,
      },
    ],
  },
  {
    name: '관리자',
    href: '/admin-manage',
    children: [{ name: '계정 권한관리', href: '/admin-manage', icon: FcList }],
  },
  {
    name: '크크쇼 메인',
    href: '/kkshow-main',
    children: [
      {
        name: '크크쇼 네비링크관리',
        href: '/kkshow-main/kkshow-subnav',
        icon: FcLink,
      },
      { name: '크크쇼 메인페이지', href: '/kkshow-main', icon: FcList },
      {
        name: '크크쇼 쇼핑페이지',
        href: '/kkshow-main/kkshow-shopping',
        icon: FcBiohazard,
      },
      {
        name: '크크쇼 방송인목록',
        href: '/kkshow-main/kkshow-bc-list',
        icon: FcBusinessman,
      },
      {
        name: '크크쇼 이벤트팝업',
        href: '/kkshow-main/kkshow-event-popup',
        icon: FcIdea,
      },
      {
        name: '크크쇼 라이브임베드',
        href: '/kkshow-main/kkshow-live-shopping',
        icon: MdOutlineLiveTv,
      },
    ],
  },
];

/** 크크쇼 소비자 마이페이지 사이드바 - "쇼핑" 하위 탭 */
const customerMypageShoppingChildrenNavLinks: Omit<MypageLink, 'icon'>[] = [
  {
    name: '장바구니',
    href: '/cart',
    checkIsActive: defaultIsActiveChecker,
  },
  {
    name: '주문/배송 내역',
    href: '/mypage/orders',
    checkIsActive: (pathname: string, linkHref: string) => {
      return pathname.includes(linkHref) || pathname === '/mypage'; // 소비자 데스크탑 마이페이지 홈에서 주문/배송내역이 표시됨
    },
  },
  {
    name: '재배송/환불 신청 내역',
    href: '/mypage/exchange-return-cancel',
    checkIsActive: defaultIsActiveChecker,
  },
  { name: '혜택관리', href: '/mypage/benefits', checkIsActive: defaultIsActiveChecker },
];
/** 크크쇼 소비자 마이페이지 사이드바 - "활동" 하위 탭 */
const customerMypageActivityChildrenNavLinks: Omit<MypageLink, 'icon'>[] = [
  // { name: '후원내역', href: '/mypage/후원내역', checkIsActive: defaultIsActiveChecker },
  // {
  //   name: '라이브 알림 내역',
  //   href: '/mypage/내역',
  //   checkIsActive: defaultIsActiveChecker,
  // },
  { name: '후기 관리', href: '/mypage/review', checkIsActive: defaultIsActiveChecker },
];
/** 크크쇼 소비자 마이페이지 사이드바 - "정보" 하위 탭 */
const customerMypageInfoChildrenNavLinks: MypageLink[] = [
  {
    name: '공지사항',
    href: '/mypage/notice',
    checkIsActive: defaultIsActiveChecker,
  },
  {
    name: '회원 정보 수정',
    href: '/mypage/info',
    checkIsActive: defaultIsActiveChecker,
  },
  {
    name: '배송지 관리',
    href: '/mypage/address',
    checkIsActive: defaultIsActiveChecker,
  },
];

/** 크크쇼 소비자 마이페이지 사이드바 메뉴 */
export const customerMypageNavLinks: MypageLink[] = [
  {
    name: '쇼핑',
    href: '',
    icon: MdShoppingBasket,
    checkIsActive: (pathname: string, _: string) => {
      // 하위탭 링크 중 하나라도 active해당되면 active처리
      return customerMypageShoppingChildrenNavLinks.some((link) =>
        link.checkIsActive(pathname, link.href),
      );
    },
    children: customerMypageShoppingChildrenNavLinks,
  },
  {
    name: '활동',
    href: '',
    icon: RiFootprintFill,
    checkIsActive: (pathname: string, _: string) => {
      return customerMypageActivityChildrenNavLinks.some((link) =>
        link.checkIsActive(pathname, link.href),
      );
    },
    children: customerMypageActivityChildrenNavLinks,
  },
  {
    name: '정보',
    href: '',
    icon: MdAccountCircle,
    checkIsActive: (pathname: string, _: string) => {
      return customerMypageInfoChildrenNavLinks.some((link) =>
        link.checkIsActive(pathname, link.href),
      );
    },
    children: customerMypageInfoChildrenNavLinks,
  },
];
