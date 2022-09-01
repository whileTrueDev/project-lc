import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsString } from 'class-validator';

export class CreateKkshowBcListDto {
  @IsString() nickname: string;
  @IsString() profileImage: string;
  @IsString() href: string;
}

export class DeleteKkshowBcListDto {
  @Type(() => Number) @IsNumber() @IsInt() id: number;
}
