import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SocialService, SellerWithSocialAccounts } from '../social/social.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private readonly socialService: SocialService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3000/auth/social/google/callback', // TODO: 개발환경에 따라 callback 주소 변경
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: null,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<SellerWithSocialAccounts> {
    const { id, displayName, emails, photos } = profile;

    const user = await this.socialService.findOrCreateSeller({
      id,
      provider: 'google',
      email: emails[0].value,
      name: displayName,
      picture: photos[0].value,
      accessToken,
      refreshToken,
    });

    return user;
  }
}
