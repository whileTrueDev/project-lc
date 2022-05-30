import { MileageStrategy } from '@prisma/client';
import { IsNumber, IsEnum } from 'class-validator';

export class MileageSettingDto {
  @IsNumber()
  defaultMileagePercent: number;

  @IsEnum(MileageStrategy)
  mileageStrategy: MileageStrategy;
}
