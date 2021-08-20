import { IsIn, IsOptional, IsString } from 'class-validator';

export class FindFmOrdersDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsIn(['주문일', '입금일']) searchDateType?: '주문일' | '입금일';
  @IsOptional() @IsString() searchStartDate?: string;
  @IsOptional() @IsString() searchEndDate?: string;
}
