import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { SendMailVerificationDto } from '@project-lc/shared-types';
import { MailVerificationService } from './mailVerification.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly mailVerificationService: MailVerificationService) {}

  // * 인증코드 메일 전송
  @Post('mail-verification')
  sendMailVerification(
    @Body(ValidationPipe) dto: SendMailVerificationDto,
  ): Promise<boolean> {
    return this.mailVerificationService.sendVerificationMail(dto.email);
  }
}
