import { IconType } from 'react-icons/lib';
import {
  MdAccountCircle,
  MdHome,
  MdOutlineSearch,
  MdShoppingBag,
  MdShoppingCart,
} from 'react-icons/md';

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
    icon: MdShoppingBag,
    name: '쇼핑',
    href: '/shopping',
    type: 'link',
  },
  {
    icon: MdOutlineSearch,
    name: '검색',
    type: 'function',
    // eslint-disable-next-line @typescript-eslint/ban-types
    onClick: (cb?: () => void) => cb(),
  },
  {
    icon: MdHome,
    name: '홈',
    href: '/',
    type: 'link',
  },
  {
    icon: MdAccountCircle,
    name: '마이페이지',
    href: '/mypage',
    type: 'link',
  },
  {
    icon: MdShoppingCart,
    name: '장바구니',
    href: '/cart',
    type: 'link',
  },
];
