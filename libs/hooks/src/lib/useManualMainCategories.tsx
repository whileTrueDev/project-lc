import { UserType } from '@prisma/client';
import {
  broadcasterCenterMypageNavLinks,
  mypageNavLinks,
  MypageLink,
} from '@project-lc/components-constants/navigation';

// 이용안내에서 사용
// mypageNav.href => manual.linkPageRouterPath 에 연결
// mainCategories.name => manual.mainCategory 에 연결
export function useManualMainCategories(userType: UserType): {
  mypageNav: MypageLink[];
  mainCategories: MypageLink[];
} {
  const mypageNav =
    userType === UserType.seller ? mypageNavLinks : broadcasterCenterMypageNavLinks;

  const mypageNavCopy = [...mypageNav];
  const sortedMyPageNavCopy = mypageNavCopy.sort((a, b) => a.name.localeCompare(b.name));

  const mainCategories = sortedMyPageNavCopy.filter((nav) => nav.isMainCategory);

  return {
    mypageNav,
    mainCategories,
  };
}

export default useManualMainCategories;
