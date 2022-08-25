import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Broadcaster } from '@prisma/client';
import { UserType } from '@project-lc/shared-types';
import { getApiHost } from '@project-lc/utils';
import { getUserTypeFromRequest } from '@project-lc/utils-backend';
import { Request } from 'express';
import OAuth2Strategy, {
  InternalOAuthError,
  StrategyOptions,
  VerifyFunction,
} from 'passport-oauth2';
import { Customer, Seller } from '.prisma/client';
import { SocialService } from '../social.service';

type NaverAuthorizationParams = {
  /** 재동의 요청의 경우 'reprompt'로 전송해야 함. 매번 로그인부터 다시 시작한다면 'reauthenticate' */
  auth_type?: 'reprompt' | 'reauthenticate';
};
/** snakecase -> camelcase 변경 타입 ex) auth_type -> authType */
type SnakeToCamel<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamel<U>>}`
  : S;
type NaverAuthorizationParamOptions = {
  [K in keyof NaverAuthorizationParams as SnakeToCamel<K>]: NaverAuthorizationParams[K];
};

export type NaverSocialProfile = {
  provider: 'naver';
  /** 동일인 식별 정보: 동일인 식별 정보는 네이버 아이디마다 고유하게 발급되는 값입니다. */
  id: string;
  /** 사용자 별명 */
  nickname?: string;
  /** 사용자 프로필 사진 URL */
  profileImage?: string;
  /** 사용자 연령대 */
  age?: string;
  /** 사용자 성별 F:여성, M:남성,U:확인불가 */
  gender?: string;
  /** 사용자 메일 주소 */
  email?: string;
  /** 휴대전화번호 */
  mobile?: string;
  /** 사용자이름 (실명) */
  name?: string;
  /** 사용자 생일(MM-DD형식) */
  birthDay?: string;
  /** 출생연도 */
  birthYear?: string;
  _raw: string;
  _json: string;
};

const NAVER_PROVIDER = 'naver';
const _authorizationURL = 'https://nid.naver.com/oauth2.0/authorize';
const _tokenURL = 'https://nid.naver.com/oauth2.0/token';
/**
 * https://developers.naver.com/docs/login/devguide/devguide.md
 */
class NaverStrategyBase extends OAuth2Strategy {
  public _profileURL = 'https://openapi.naver.com/v1/nid/me';
  constructor(options: Partial<StrategyOptions>, verify: VerifyFunction) {
    super(
      {
        ...(options as StrategyOptions),
        authorizationURL: options.authorizationURL || _authorizationURL,
        tokenURL: options.tokenURL || _tokenURL,
      },
      verify,
    );
    this.name = NAVER_PROVIDER;
  }

  authorizationParams(options: NaverAuthorizationParamOptions): object {
    return { auth_type: options.authType, ...options };
  }

  userProfile(accessToken: string, done: (err?: Error, profile?: any) => void): void {
    this._oauth2.get(this._profileURL, accessToken, (err: any, responseJson: string) => {
      if (err) {
        return done(
          new InternalOAuthError('네이버로부터 UserProfile을 가져오지 못함.', err),
        );
      }

      try {
        const body = JSON.parse(responseJson);
        const { response, resultcode } = body;
        if (resultcode !== '00') {
          return done(new InternalOAuthError('네이버로부터 00이 아닌 응답을 받음', err));
        }
        const profile: NaverSocialProfile = {
          provider: NAVER_PROVIDER,
          id: response.id,
          name: response.name,
          email: response.email,
          nickname: response.nickname,
          profileImage: response.profile_image,
          age: response.age,
          gender: response.gender,
          mobile: response.mobile,
          birthDay: response.birthday,
          birthYear: response.birthyear,
          _raw: responseJson,
          _json: body,
        };
        return done(null, profile);
      } catch (_err) {
        return done(
          new InternalOAuthError('네이버로부터 전달받은 profile 파싱 중 에러', _err),
        );
      }
    });
  }
}

@Injectable()
export class NaverStrategy extends PassportStrategy(NaverStrategyBase, NAVER_PROVIDER) {
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
    profile: NaverSocialProfile,
  ): Promise<Seller | Broadcaster | Customer> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, nickname, id, name, profileImage } = profile;

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
      name,
      nickname,
      // 220822 주석처리 => 연관일감: [회원가입] 소셜로그인시 프로필사진 받아온 프로필사진으로 설정하지 않기 by dan
      // picture: profile_image,
      accessToken,
      refreshToken,
    });

    return user;
  }
}
