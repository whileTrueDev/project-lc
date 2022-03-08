import { IsString } from 'class-validator';

export class MailVerificationDto {
  @IsString() targetEmail: string;
  @IsString() code: string;
}
