import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard, LocalAuthGuard } from '@project-lc/nest-modules-authguard';
import { MailVerificationService } from '@project-lc/nest-modules-mail-verification';
import {
  EmailCodeVerificationDto,
  loginUserRes,
  SendMailVerificationDto,
  UserProfileRes,
  UserType,
} from '@project-lc/shared-types';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { AuthService } from '@project-lc/nest-modules-auth';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService, // private readonly loginHistoryService: LoginHistoryService, // private readonly mailVerificationService: MailVerificationService,
  ) {}

  // 최초 로그인을 담당할 Router 구현하기
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body('stayLogedIn') stayLogedIn: boolean,
    @Query('type') userType: UserType,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = req.body;
    console.log(req.body);
    console.log(user);

    const loginToken: loginUserRes = this.authService.issueToken(
      user,
      stayLogedIn,
      userType,
    );
    this.authService.handleLogin(res, loginToken);
    // 로그인 히스토리 추가
    // this.loginHistoryService.createLoginStamp(req, '이메일');
    return res.status(200).send({ ...loginToken, id: user.id, userType: user.type });
  }
}
