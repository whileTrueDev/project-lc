import { Customer } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsOptional, IsBoolean, IsString, IsIn, ValidateNested } from 'class-validator';
import { FindManyDto } from './findMany.dto';

// findCustomers include 옵션
export class CustomerIncludeDto {
  /** 마일리지 정보를 함꼐 불러올 지 */
  @IsOptional() @IsBoolean() mileage?: boolean;
  /** 쿠폰 정보를 함꼐 불러올 지 */
  @IsOptional() @IsBoolean() coupons?: boolean;
  /** 상품리뷰정보를 함께 불러올 지 */
  @IsOptional() @IsBoolean() goodsReview?: boolean;
  /** 주소록 정보를 함께 불러올 지 */
  @IsOptional() @IsBoolean() addresses?: boolean;
}

export class FindCustomerDto extends FindManyDto {
  @IsOptional()
  @IsString()
  @IsIn([
    'id',
    'name',
    'password',
    'email',
    'nickname',
    'phone',
    'createDate',
    'gender',
    'birthDate',
    'agreementFlag',
    'inactiveFlag',
  ])
  orderByColumn?: keyof Customer;

  @IsOptional()
  @Type(() => CustomerIncludeDto)
  @ValidateNested()
  includeOpts?: CustomerIncludeDto;
}
