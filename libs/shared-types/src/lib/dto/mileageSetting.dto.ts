import { IsNumber, IsEnum } from 'class-validator';
import { MileageStrategy } from 'prisma/prisma-client';

export class MileageSettingDto {
  @IsNumber()
  defaultMileagePercent: number;

  @IsEnum(MileageStrategy)
  mileageStrategy: MileageStrategy;
}
