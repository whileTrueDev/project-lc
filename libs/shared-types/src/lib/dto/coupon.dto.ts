import {
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsDate,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AmountUnit, DiscountApplyField, DiscountApplyType, Goods } from '@prisma/client';

export class CouponDto {
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

  @IsString()
  name: string;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsOptional()
  @IsDate()
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

  @IsOptional()
  @IsNumber({}, { each: true })
  goods?: Goods['id'][];
}
