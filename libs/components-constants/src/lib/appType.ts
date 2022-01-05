import { UserType } from '@project-lc/shared-types';

const appTypes: Record<UserType, string> = {
  seller: '판매자센터',
  broadcaster: '방송인센터',
  admin: '관리자페이지',
};
export const renderAppType = (appType: UserType): string => appTypes[appType];
