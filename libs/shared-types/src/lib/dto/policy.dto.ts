import { PolicyCategory, PolicyTarget } from '@prisma/client';
import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

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

export class UpdatePolicyDto {
  @IsEnum(PolicyCategory)
  @IsOptional()
  category?: PolicyCategory;

  @IsEnum(PolicyTarget)
  @IsOptional()
  targetUser?: PolicyTarget;

  @IsString()
  @IsOptional()
  content?: string;

  @IsDateString()
  @IsOptional()
  enforcementDate?: Date;

  @IsString()
  @IsOptional()
  version?: string;

  @IsBoolean()
  @IsOptional()
  publicFag?: boolean;
}
