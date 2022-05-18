import { Customer } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

// ------------------생성 dto--------------------
export class FindReviewNeededOrderItemsDto {
  @Type(() => Number) @IsNumber() customerId: Customer['id'];
}
