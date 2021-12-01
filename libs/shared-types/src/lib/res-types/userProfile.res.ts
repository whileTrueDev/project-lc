export type UserType = 'seller' | 'broadcaster' | 'admin';

export interface UserProfileRes {
  type: UserType;
  id: number;
  name: string | null;
  email: string;
  hasPassword: boolean | null;
  shopName?: string | null;
  avatar?: string;
}
