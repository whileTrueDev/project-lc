export type UserType = 'seller' | 'creator';

export interface UserProfileRes {
  type: UserType;
  id: number;
  name: string | null;
  email: string;
  hasPassword: boolean | null;
  storeName?: string | null;
}
