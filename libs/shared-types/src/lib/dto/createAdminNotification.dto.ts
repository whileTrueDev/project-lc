import { IsIn, IsString } from 'class-validator';
import type { UserType } from '../res-types/userProfile.res';

export class CreateNotificationDto {
  @IsString()
  userEmail: string;

  @IsIn(['seller', 'broadcaster', 'admin'])
  userType: UserType;

  @IsString()
  title: string;

  @IsString()
  content: string;
}
export class CreateMultipleNotificationDto {
  @IsString({ each: true })
  userEmailList: string[];

  @IsIn(['seller', 'broadcaster', 'admin'])
  userType: UserType;

  @IsString()
  title: string;

  @IsString()
  content: string;
}
