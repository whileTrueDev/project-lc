import { PolicyCategory, PolicyTarget } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreatePolicyDto {
  @IsEnum(PolicyCategory)
  category: PolicyCategory;

  @IsEnum(PolicyTarget)
  targetUser: PolicyTarget;

  @IsString()
  content: string;

  @IsOptional()
  @IsDateString()
  enforcementDate?: Date;
}
