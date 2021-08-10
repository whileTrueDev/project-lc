import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3000/auth/google/callback', // TODO: 개발환경에 따라 callback 주소 변경
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: null,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, displayName, emails, photos } = profile;
    const user = {
      id,
      email: emails[0].value,
      name: displayName,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
