import { HiHome } from 'react-icons/hi';
import { RiShoppingCart2Line } from 'react-icons/ri';
import { IconType } from 'react-icons/lib';
import { FaSearch } from 'react-icons/fa';

type QuickMenuType = 'link' | 'function';

interface QuickMenuBase {
  icon: IconType;
  name: string;
  type: QuickMenuType;
}

interface LinkMenuItem extends QuickMenuBase {
  type: 'link';
  href?: string;
}

interface FunctionMenuItem extends QuickMenuBase {
  type: 'function';
  onClick?: any;
}

type QuickMenuLink = LinkMenuItem | FunctionMenuItem;

/** 판매자 마이페이지 링크 */
export const quickMenuLinks: QuickMenuLink[] = [
  {
    icon: FaSearch,
    name: '검색',
    type: 'function',
    onClick: () => alert('검색 모달창'), // 검색기능 구현시 검색 모달로 변경
  },
  {
    icon: HiHome,
    name: '홈',
    href: '/',
    type: 'link',
  },
  {
    icon: RiShoppingCart2Line,
    name: '쇼핑',
    href: 'https://m.k-kmarket.com/', // 추후 자체 크크쇼몰 생기면 그 주소로 변경
    type: 'link',
  },
];
