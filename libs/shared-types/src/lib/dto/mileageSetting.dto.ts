import { MileageStrategy } from '@prisma/client';
import { IsNumber, IsEnum, IsOptional } from 'class-validator';

export class MileageSettingDto {
  @IsNumber()
  defaultMileagePercent: number;

  @IsEnum(MileageStrategy)
  mileageStrategy: MileageStrategy;
}

export class MileageSettingUpdateDto {
  @IsNumber()
  @IsOptional()
  defaultMileagePercent?: number;

  @IsEnum(MileageStrategy)
  @IsOptional()
  mileageStrategy?: MileageStrategy;
}
