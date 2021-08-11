import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { SendMailVerificationDto } from '@project-lc/shared-types';
import { MailService } from '../mail/mail.service';
import { MailVerificationService } from './mailVerification.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly mailVerificationService: MailVerificationService,
    private readonly mailService: MailService,
    private readonly authService: AuthService,
  ) {}

  // * 인증코드 메일 전송
  @Post('mail-verification')
  sendMailVerification(
    @Body(ValidationPipe) dto: SendMailVerificationDto,
  ): Promise<boolean> {
    return this.mailService.sendVerificationMail(dto.email);
  }
}
