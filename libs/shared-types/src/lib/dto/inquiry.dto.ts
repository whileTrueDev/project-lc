import { IsEnum, IsOptional, IsString } from 'class-validator';
import { InquiryType } from '@prisma/client';

export class InquiryDTO {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  brandName: string;

  @IsString()
  @IsOptional()
  homepage: string;

  @IsEnum(InquiryType)
  type: InquiryType;
}
