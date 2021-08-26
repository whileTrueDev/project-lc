import { IsEmail, IsString } from 'class-validator';

export class PasswordValidateDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
