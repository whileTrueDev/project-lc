import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserPayload } from '../auth.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // user 검증에 사용할 형태를 정의한다.
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<UserPayload> {
    const userPayload = await this.authService.validateUser(email, password);
    if (!userPayload) {
      throw new UnauthorizedException();
    }
    return userPayload;
  }
}
