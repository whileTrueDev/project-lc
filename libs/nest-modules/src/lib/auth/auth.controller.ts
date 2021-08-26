import {
  Controller,
  Get,
  Post,
  Req,
  Body,
  UseGuards,
  Res,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import {
  SendMailVerificationDto,
  loginUserRes,
  EmailCodeVerificationDto,
} from '@project-lc/shared-types';
import { Request, Response } from 'express';
import { MailVerificationService } from './mailVerification.service';
import { LocalAuthGuard } from '../_nest-units/guards/local-auth.guard';
import { JwtAuthGuard } from '../_nest-units/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { UserType } from './auth.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly mailVerificationService: MailVerificationService,
  ) {}

  // 최초 로그인을 담당할 Router 구현하기
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body('stayLogedIn') stayLogedIn: boolean,
    @Query('type') userType: UserType,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { user }: any = req;
    const loginToken: loginUserRes = this.authService.issueToken(
      user,
      stayLogedIn,
      userType,
    );
    this.authService.handleLoginHeader(res, loginToken);
    res.status(200).send(loginToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Res() res) {
    this.authService.handleLogoutHeader(res);
    res.sendStatus(200);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    // return req.user;
    return this.authService.getProfile(req.user);
  }

  // * 인증코드 메일 전송
  @Post('mail-verification')
  sendMailVerification(
    @Body(ValidationPipe) dto: SendMailVerificationDto,
  ): Promise<boolean> {
    return this.mailVerificationService.sendVerificationMail(dto.email);
  }

  // * 인증코드가 맞는지 확인
  @Post('code-verification')
  async verifyCode(
    @Body(ValidationPipe) dto: EmailCodeVerificationDto,
  ): Promise<boolean> {
    const matchingRecord = await this.mailVerificationService.checkMailVerification(
      dto.email,
      dto.code,
    );
    if (!matchingRecord) return false;
    await this.mailVerificationService.deleteSuccessedMailVerification(dto.email);
    return true;
  }
}
