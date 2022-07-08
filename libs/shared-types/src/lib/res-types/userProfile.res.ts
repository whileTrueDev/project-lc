import { BroadcasterPromotionPage, AdminType } from '@prisma/client';

export type UserType = 'seller' | 'broadcaster' | 'admin' | 'customer';

export interface UserProfileRes {
  type: UserType;
  id: number;
  email: string;
  hasPassword: boolean | null;
  name?: string | null;
  shopName?: string | null;
  avatar?: string;
  agreementFlag?: boolean;
  overlayUrl?: string;
  broadcasterPromotionPage?: BroadcasterPromotionPage;
  adminClass?: AdminType;
}
