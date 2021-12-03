import { IsEmail, IsInt, IsNumberString, IsOptional } from 'class-validator';

export class FindBroadcasterDto {
  @IsOptional() @IsNumberString() id?: string | number;
  @IsOptional() @IsEmail() email?: string;
}
