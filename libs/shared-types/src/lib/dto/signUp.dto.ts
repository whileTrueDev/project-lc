import { IsEmail, IsString, Length } from 'class-validator';

export class SignUpDto {
  @IsEmail() email: string;

  @IsString() name: string;

  @IsString() password: string;

  @IsString() @Length(6) code: string;
}
