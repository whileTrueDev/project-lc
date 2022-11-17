import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LoginHistory } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { Request } from 'express';
import geoip from 'geoip-lite';
import UAParser from 'ua-parser-js';

export type LoginMethods = '이메일' | '소셜/카카오' | '소셜/네이버' | '소셜/구글';

@Injectable()
export class LoginHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  /** 로그인 내역 저장 */
  public async createLoginStamp(
    req: Request,
    loginMethod: LoginMethods,
  ): Promise<LoginHistory> {
    const { ip, user } = req;
    const geo = geoip.lookup(ip);
    const uaParser = new UAParser(req.get('User-Agent'));
    const device = uaParser.getDevice();

    try {
      return this.prisma.loginHistory.create({
        data: {
          ip,
          // https://github.com/faisalman/ua-parser-js/issues/419
          // 일반적으로 값이 없는 경우, PC로 가정할 수 있다.
          device: device.type || 'PC',
          country: geo?.country || '',
          city: geo?.city || '',
          method: loginMethod,
          ua: uaParser.getUA(),
          userEmail: user.sub,
          userType: user.type,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
