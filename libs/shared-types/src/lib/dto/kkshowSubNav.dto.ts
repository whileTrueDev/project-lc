import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateKkshowSubNavDto {
  @Type(() => Number) @IsNumber() index: number;
  @IsString() name: string;
  @IsString() link: string;
}

export class UpdateKkshowSubNavDto {
  @IsOptional() @Type(() => Number) id: number;
  @IsOptional() @Type(() => Number) @IsNumber() index: number;
  @IsOptional() @IsString() name: string;
  @IsOptional() @IsString() link: string;
}
