import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class FindManyDto {
  @Type(() => Number) @IsOptional() @IsNumber() take?: number;
  @Type(() => Number) @IsOptional() @IsNumber() skip?: number;
}
