import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UserPayload, UserType } from '../auth.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // user 검증에 사용할 형태를 정의한다.
    super({
      usernameField: 'email',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, email: string, password: string): Promise<UserPayload> {
    const userPayload = await this.authService.validateUser(
      req.query.type as UserType,
      email,
      password,
    );
    if (!userPayload) {
      throw new UnauthorizedException();
    }
    return userPayload;
  }
}
