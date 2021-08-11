import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
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

  // 소셜로그인 ******************************************************************************************

  private readonly frontMypageUrl = 'http://localhost:3000/'; // TODO: front mypage로 리다이렉션

  /** 구글 로그인 */
  @Get('/google/login')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  async googleAuth(@Req() req) {}

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(req.user);
    res.cookie('accessToken', accessToken);
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.redirect(this.frontMypageUrl);
  }

  /** 네이버 로그인 */
  @Get('/naver/login')
  @UseGuards(AuthGuard('naver'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  async naverAuth(@Req() req) {}

  @Get('/naver/callback')
  @UseGuards(AuthGuard('naver'))
  async naverAuthCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(req.user);
    res.cookie('accessToken', accessToken);
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.redirect(this.frontMypageUrl);
  }
}
