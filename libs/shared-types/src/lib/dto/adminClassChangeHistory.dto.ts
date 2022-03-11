import { IsEmail, IsEnum, IsNumber } from 'class-validator';
import { AdminType } from '@prisma/client';

export class AdminClassChangeHistoryDto {
  @IsNumber() id: number;

  @IsEmail() adminEmail: string;

  @IsEmail() targetEmail: string;

  @IsEnum(AdminType) originalAdminClass: AdminType;

  @IsEnum(AdminType) newAdminClass: AdminType;
}

export type AdminClassChangeHistoryDtoWithoutId = Omit<AdminClassChangeHistoryDto, 'id'>;
