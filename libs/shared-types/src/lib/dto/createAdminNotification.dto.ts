import { UserType } from '@project-lc/shared-types';

export class CreateNotificationDto {
  userEmail: string;
  userType: UserType;
  title: string;
  content: string;
}
export class CreateMultipleNotificationDto {
  userEmailList: string[];
  userType: UserType;
  title: string;
  content: string;
}
