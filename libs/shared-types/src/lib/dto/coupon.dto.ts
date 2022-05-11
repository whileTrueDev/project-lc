import { AmountUnit, DiscountApplyField, DiscountApplyType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CouponDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsEnum(AmountUnit)
  unit?: AmountUnit;

  @IsOptional()
  @IsNumber()
  maxDiscountAmountWon?: number;

  @IsOptional()
  @IsNumber()
  minOrderAmountWon?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsEnum(DiscountApplyField)
  applyField?: DiscountApplyField;

  @IsOptional()
  @IsEnum(DiscountApplyType)
  applyType?: DiscountApplyType;

  @IsOptional()
  @IsString()
  memo?: string;

  @IsOptional()
  @IsBoolean()
  concurrentFlag?: boolean;
}
