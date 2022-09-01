import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateKkshowBcListDto {
  @IsString() nickname: string;
  @IsString() profileImage: string;
  @IsString() href: string;
  @Type(() => Number) @IsOptional() @IsInt() broadcasterId?: number;
}

export class DeleteKkshowBcListDto {
  @Type(() => Number) @IsNumber() @IsInt() id: number;
}
