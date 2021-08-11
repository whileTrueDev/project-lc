import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-kakao';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SocialService, SellerWithSocialAccounts } from '../social.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    private configService: ConfigService,
    private readonly socialService: SocialService,
  ) {
    super({
      clientID: configService.get('KAKAO_CLIENT_ID'),
      callbackURL: 'http://localhost:3000/auth/social/kakao/callback', // TODO: 개발환경에 따라 callback 주소 변경
    });
  }

  async validate(
    accessToken: string,
    refreshToken: null,
    profile: Profile,
  ): Promise<SellerWithSocialAccounts> {
    const { id, username, _json } = profile;
    const { kakao_account } = _json;
    const { email, profile_image_url, is_default_image } = kakao_account;

    const user = await this.socialService.findOrCreateSeller({
      id: String(id), // Profile에 타입정의는 string으로 되어있는데 실제값은 숫자로 넘어옴
      provider: 'kakao',
      email,
      name: username,
      picture: is_default_image ? '' : profile_image_url,
      accessToken,
      refreshToken,
    });

    return user;
  }
}
