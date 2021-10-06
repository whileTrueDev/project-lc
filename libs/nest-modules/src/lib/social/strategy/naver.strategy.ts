// import { getApiHost } from '@project-lc/hooks';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
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
      callbackURL: `http://localhost:3000/social/naver/callback`,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: null,
    profile: Profile,
  ): Promise<Seller> {
    const { email, nickname, profile_image, id } = profile._json;

    if (!email) {
      throw new ForbiddenException({
        provider: NAVER_PROVIDER,
        providerId: id,
        message: 'email-required',
        accessToken,
      });
    }

    const user = await this.socialService.findOrCreateSeller({
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
