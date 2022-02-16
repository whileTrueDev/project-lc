import { PolicyCategory, PolicyTarget } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreatePolicyDto {
  @IsEnum(PolicyCategory)
  category: PolicyCategory;

  @IsEnum(PolicyTarget)
  targetUser: PolicyTarget;

  @IsString()
  content: string;

  @IsDate()
  @Type(() => Date)
  enforcementDate: Date;

  @IsString()
  @IsOptional()
  version?: string;

  @IsBoolean()
  @IsOptional()
  publicFlag?: boolean;
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

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  enforcementDate?: Date;

  @IsString()
  @IsOptional()
  version?: string;

  @IsBoolean()
  @IsOptional()
  publicFlag?: boolean;
}
