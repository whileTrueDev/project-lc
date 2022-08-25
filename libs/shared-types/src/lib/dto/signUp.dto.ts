import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class SignUpDto {
  @IsEmail() email: string;

  @IsOptional() @IsString() nickname?: string;

  @IsString() name: string;

  @IsString() password: string;

  @IsString() @Length(6) code: string;
}
