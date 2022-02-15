import { PolicyCategory, PolicyTarget } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePolicyDto {
  @IsEnum(PolicyCategory)
  category: PolicyCategory;

  @IsEnum(PolicyTarget)
  targetUser: PolicyTarget;

  @IsString()
  content: string;

  @IsDateString()
  enforcementDate: Date;

  @IsString()
  @IsOptional()
  version?: string;

  @IsBoolean()
  @IsOptional()
  publicFag?: boolean;
}

export class GetPolicyListDto {
  @IsEnum(PolicyCategory)
  category: PolicyCategory;

  @IsEnum(PolicyTarget)
  targetUser: PolicyTarget;
}
