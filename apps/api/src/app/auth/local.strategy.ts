import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SellerPayload } from '../login.interface';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // user 검증에 사용할 형태를 정의한다.
    super({
      usernameField: 'email',
    });
    // super();
  }

  // 사용자에 따라서 데이터 다른 동작을 하도록 해야한다.
  async validate(email: string, pwdInput: string): Promise<SellerPayload> {
    const user = await this.authService.validateUser(email);
    if (!user) {
      throw new UnauthorizedException();
    }

    const passwordCheck = await this.authService.validatePassword(
      pwdInput,
      user.password,
    );
    if (!passwordCheck) {
      throw new UnauthorizedException();
    }

    const { password, ...payload } = user;
    return payload;
  }
}
