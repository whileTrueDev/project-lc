import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { InquiryType } from '@prisma/client';

export class InquiryDto {
  @IsString()
  name: string;

  @IsString()
  content: string;

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

  @IsBoolean()
  readFlag: boolean;
}

export type InquiryDtoWithoutReadFlag = Omit<InquiryDto, 'readFlag'>;
