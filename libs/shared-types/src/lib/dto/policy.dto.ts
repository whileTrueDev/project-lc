import { PolicyCategory, PolicyTarget } from '@prisma/client';
import { IsDateString, IsEnum, IsString } from 'class-validator';

export class CreatePolicyDto {
  @IsEnum(PolicyCategory)
  category: PolicyCategory;

  @IsEnum(PolicyTarget)
  targetUser: PolicyTarget;

  @IsString()
  content: string;

  @IsDateString()
  enforcementDate: Date;
}

export class GetPolicyListDto {
  @IsEnum(PolicyCategory)
  category: PolicyCategory;

  @IsEnum(PolicyTarget)
  targetUser: PolicyTarget;
}
