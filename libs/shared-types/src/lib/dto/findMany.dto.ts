import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class FindManyDto {
  @Type(() => Number) @IsOptional() @IsNumber() take?: number = 3;
  @Type(() => Number) @IsOptional() @IsNumber() skip?: number = 0;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  orderBy?: Prisma.SortOrder;
}
