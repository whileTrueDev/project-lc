export type UserType = 'seller' | 'creator';

export interface UserProfileRes {
  type: UserType;
  id: number;
  name: string;
  email: string;
  hasPassword: boolean;
}
