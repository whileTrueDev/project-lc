// import { getApiHost } from '@project-lc/hooks';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { SocialService } from '../social.service';

const GOOGLE_PROVIDER = 'google';
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, GOOGLE_PROVIDER) {
  constructor(
    private configService: ConfigService,
    private readonly socialService: SocialService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: `http://localhost:3000/social/google/callback`, // TODO: 개발환경에 따라 callback 주소 변경
      scope: ['email', 'profile'],
    });
  }

  authorizationParams(option: any): any {
    // https://developers.google.com/identity/protocols/oauth2/web-server#creatingclient
    return Object.assign(option, {
      access_type: 'offline', // refresh_token을 받기 위해서는 요청시 해당 파라미터가 필요하다.
      include_granted_scopes: true,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: null,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { id, displayName, emails, photos } = profile;

    if (!emails[0].value) {
      throw new ForbiddenException({
        provider: GOOGLE_PROVIDER,
        providerId: id,
        message: 'email-required',
        accessToken,
      });
    }

    const user = await this.socialService.findOrCreateSeller({
      id,
      provider: GOOGLE_PROVIDER,
      email: emails[0].value,
      name: displayName,
      picture: photos[0].value,
      accessToken,
      refreshToken,
    });

    return user;
  }
}
