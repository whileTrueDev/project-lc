type UserType = 'seller' | 'broadcaster';

export type LastLoginDate = {
  userType: UserType;
  userEmail: string;
  timeDiff: number;
};

export interface TargetUser {
  userEmail: string;
  inactivateDate?: string;
  userType: UserType;
}
