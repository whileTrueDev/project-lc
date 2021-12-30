import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Broadcaster } from '@prisma/client';
import { UserType } from '@project-lc/shared-types';
import { getApiHost } from '@project-lc/utils';
import { getUserTypeFromRequest } from '@project-lc/utils-backend';
import { Request } from 'express';
import { Profile, Strategy } from 'passport-naver';
import { Seller } from '.prisma/client';
import { SocialService } from '../social.service';

const NAVER_PROVIDER = 'naver';
@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, NAVER_PROVIDER) {
  constructor(
    private configService: ConfigService,
    private readonly socialService: SocialService,
  ) {
    super({
      clientID: configService.get('NAVER_CLIENT_ID'),
      clientSecret: configService.get('NAVER_CLIENT_SECRET'),
      callbackURL: `${getApiHost()}/social/naver/callback`,
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: null,
    profile: Profile,
  ): Promise<Seller | Broadcaster> {
    const { email, nickname, profile_image, id } = profile._json;

    if (!email) {
      throw new ForbiddenException({
        provider: NAVER_PROVIDER,
        providerId: id,
        message: 'email-required',
        accessToken,
      });
    }

    const userType: UserType = getUserTypeFromRequest(req);

    const user = await this.socialService.findOrCreateUser(userType, {
      id,
      provider: NAVER_PROVIDER,
      email,
      name: nickname,
      picture: profile_image,
      accessToken,
      refreshToken,
    });

    return user;
  }
}
