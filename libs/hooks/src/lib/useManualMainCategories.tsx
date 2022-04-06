import { UserType } from '@prisma/client';
import {
  ManualLinkPage,
  ManualMainCategory,
  linkPage,
  mainCategory,
} from '@project-lc/components-constants/manual';

// 이용안내에서 사용
export function useManualMainCategories(userType: UserType): {
  linkPages: ManualLinkPage[];
  mainCategories: ManualMainCategory[];
} {
  const linkPages = linkPage[userType];
  const mainCategories = mainCategory[userType];
  return {
    linkPages,
    mainCategories,
  };
}

export default useManualMainCategories;
