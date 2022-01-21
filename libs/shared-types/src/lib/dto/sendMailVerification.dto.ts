import { IsBoolean, IsEmail, IsOptional } from 'class-validator';

export class SendMailVerificationDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsBoolean()
  isNotInitial?: boolean;
}
