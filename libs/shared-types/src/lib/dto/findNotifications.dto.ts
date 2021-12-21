import { IsNumber, IsString, IsIn } from 'class-validator';
import { UserType } from '../res-types/userProfile.res';

export class FindNotificationsDto {
  @IsString()
  userEmail: string;

  @IsIn(['seller', 'broadcaster', 'admin'])
  userType: UserType;

  @IsNumber()
  take?: number;
}
