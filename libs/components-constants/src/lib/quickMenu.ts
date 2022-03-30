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

export type QuickMenuLink = LinkMenuItem | FunctionMenuItem;

/** 판매자 마이페이지 링크 */
export const quickMenuLinks: QuickMenuLink[] = [
  {
    icon: FaSearch,
    name: '검색',
    href: '/search',
    type: 'link',
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
    href: '/shopping',
    type: 'link',
  },
];
