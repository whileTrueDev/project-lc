import { Body, Controller, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import {
  JwtAuthGuard,
  LocalAuthGuard,
  AdminGuard,
} from '@project-lc/nest-modules-authguard';
import { loginUserRes, UserType } from '@project-lc/shared-types';
import { Request, Response } from 'express';
import { AuthService, LoginHistoryService } from '@project-lc/nest-modules-auth';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly loginHistoryService: LoginHistoryService,
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
    const { user } = req;

    const loginToken: loginUserRes = this.authService.issueToken(
      user,
      stayLogedIn,
      userType,
    );
    this.authService.handleLogin(res, loginToken);

    // 로그인 히스토리 추가
    this.loginHistoryService.createLoginStamp(req, '이메일');
    return res.status(200).send({ ...loginToken, id: user.id, userType: user.type });
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('logout')
  logout(@Res() res): void {
    this.authService.handleLogout(res);
    res.sendStatus(200);
  }
}
