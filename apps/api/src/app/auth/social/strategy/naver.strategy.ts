import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-naver';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SocialService, SellerWithSocialAccounts } from '../social.service';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(
    private configService: ConfigService,
    private readonly socialService: SocialService,
  ) {
    super({
      clientID: configService.get('NAVER_CLIENT_ID'),
      clientSecret: configService.get('NAVER_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3000/auth/social/naver/callback', // TODO: 개발환경에 따라 callback 주소 변경
    });
  }

  async validate(
    accessToken: string,
    refreshToken: null,
    profile: Profile,
  ): Promise<SellerWithSocialAccounts> {
    const { email, nickname, profile_image, id } = profile._json;
    const user = await this.socialService.findOrCreateSeller({
      id,
      provider: 'naver',
      email,
      name: nickname,
      picture: profile_image,
      accessToken,
      refreshToken,
    });

    return user;
  }
}
