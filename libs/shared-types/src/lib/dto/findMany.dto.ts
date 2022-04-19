import { IsNumber, IsOptional } from 'class-validator';

export class FindManyDto {
  @IsOptional() @IsNumber() take?: number;
  @IsOptional() @IsNumber() skip?: number;
}
