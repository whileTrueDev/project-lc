import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SendMailVerificationDto } from '@project-lc/shared-types';
import { MailService } from '../mail/mail.service';
import { MailVerificationService } from './mailVerification.service';
import { SocialService } from './social/social.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly mailVerificationService: MailVerificationService,
    private readonly mailService: MailService,
    private readonly socialService: SocialService,
  ) {}

  // * 인증코드 메일 전송
  @Post('mail-verification')
  sendMailVerification(@Body(ValidationPipe) dto: SendMailVerificationDto) {
    return this.mailService.sendVerificationMail(dto.email);
  }

  /** 구글 로그인 */
  @Get('/google/login')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  async googleAuth(@Req() req) {}

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthCallback(@Req() req) {
    return this.socialService.googleLogin(req);
  }
}
