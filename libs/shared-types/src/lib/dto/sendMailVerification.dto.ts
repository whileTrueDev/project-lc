import { IsEmail } from 'class-validator';

export class SendMailVerificationDto {
  @IsEmail()
  email: string;
}
