import { FaSearch } from 'react-icons/fa';
import { HiHome } from 'react-icons/hi';
import { IconType } from 'react-icons/lib';
import { RiShoppingCart2Line } from 'react-icons/ri';

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
  // eslint-disable-next-line @typescript-eslint/ban-types
  onClick?: Function;
}

export type QuickMenuLink = LinkMenuItem | FunctionMenuItem;

/** 판매자 마이페이지 링크 */
export const quickMenuLinks: QuickMenuLink[] = [
  {
    icon: FaSearch,
    name: '검색',
    type: 'function',
    // eslint-disable-next-line @typescript-eslint/ban-types
    onClick: (cb?: () => void) => cb(),
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
