import { IsOptional, IsBoolean } from 'class-validator';

export class CustomerIncludeDto {
  @IsOptional() @IsBoolean() mileage?: boolean;
  @IsOptional() @IsBoolean() coupons?: boolean;
  @IsOptional() @IsBoolean() goodsReview?: boolean;
  @IsOptional() @IsBoolean() addresses?: boolean;
}
