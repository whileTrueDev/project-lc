import { IsEmail, IsEnum, IsNumber } from 'class-validator';
import { AdminType } from '@prisma/client';

export class AdminClassDto {
  @IsNumber() id: number;

  @IsEmail() email: string;

  @IsEnum(AdminType) adminClass: AdminType;
}
