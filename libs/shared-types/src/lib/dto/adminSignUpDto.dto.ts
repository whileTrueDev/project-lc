import { IsEmail, IsString } from 'class-validator';

export class AdminSignUpDto {
  @IsEmail() email: string;

  @IsString() password: string;
}
