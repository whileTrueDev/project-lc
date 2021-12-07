// import { getApiHost } from '@project-lc/hooks';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserType } from '@project-lc/shared-types';
import { getApiHost, getUserTypeFromRequest } from '@project-lc/utils';
import { Request } from 'express';
import { Profile, Strategy } from 'passport-kakao';
import { Broadcaster, Seller } from '.prisma/client';
import { SocialService } from '../social.service';

const KAKAO_PROVIDER = 'kakao';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, KAKAO_PROVIDER) {
  constructor(
    private configService: ConfigService,
    private readonly socialService: SocialService,
  ) {
    super({
      clientID: configService.get('KAKAO_CLIENT_ID'),
      callbackURL: `${getApiHost()}/social/kakao/callback`,
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: null,
    profile: Profile,
  ): Promise<Seller | Broadcaster> {
    const { id, username, _json } = profile;
    const { kakao_account } = _json;
    const { email, profile: kakaoProfile } = kakao_account;
    const { is_default_image, profile_image_url } = kakaoProfile;

    if (!email) {
      throw new ForbiddenException({
        provider: KAKAO_PROVIDER,
        providerId: id,
        message: 'email-required',
        accessToken,
      });
    }

    const userType: UserType = getUserTypeFromRequest(req);

    const user = await this.socialService.findOrCreateUser(userType, {
      id: String(id), // Profile에 타입정의는 string으로 되어있는데 실제값은 숫자로 넘어옴
      provider: KAKAO_PROVIDER,
      email,
      name: username,
      picture: is_default_image ? '' : profile_image_url,
      accessToken,
      refreshToken,
    });

    return user;
  }
}
