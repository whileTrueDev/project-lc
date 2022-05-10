import { IsNumber, IsEnum, IsOptional } from 'class-validator';
import { MileageStrategy } from 'prisma/prisma-client';

export class MileageSettingDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNumber()
  defaultMileagePercent: number;

  @IsEnum(MileageStrategy)
  mileageStrategy: MileageStrategy;
}
