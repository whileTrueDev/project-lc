import { Customer, Gender } from '@prisma/client';
import { IsBoolean, IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCustomerDto {
  @IsOptional() @IsString() nickname?: Customer['nickname'];
  @IsOptional() @IsString() phone?: Customer['phone'];
  @IsOptional() @IsEnum(Gender) gender?: Customer['gender'];
  @IsOptional() @IsDate() @Type(() => Date) birthDate?: Customer['birthDate'];
  @IsOptional() @IsBoolean() agreementFlag?: Customer['agreementFlag'];
}
