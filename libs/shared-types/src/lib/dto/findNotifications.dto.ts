import { Type } from 'class-transformer';
import { IsNumber, IsString, IsIn, IsOptional } from 'class-validator';
import type { UserType } from '../res-types/userProfile.res';

export class FindNotificationsDto {
  @IsString()
  userEmail: string;

  @IsIn(['seller', 'broadcaster', 'admin'])
  userType: UserType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  take?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  skip?: number;
}
