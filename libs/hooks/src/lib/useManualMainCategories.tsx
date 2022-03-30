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
  const mypageNav = (
    userType === UserType.seller ? mypageNavLinks : broadcasterCenterMypageNavLinks
  ).sort((a, b) => a.name.localeCompare(b.name));

  const mainCategories = mypageNav.filter((nav) => nav.isMainCategory);

  return {
    mypageNav,
    mainCategories,
  };
}

export default useManualMainCategories;
