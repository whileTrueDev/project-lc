import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AdminModule } from '@project-lc/nest-modules-admin';
import { BroadcasterModule } from '@project-lc/nest-modules-broadcaster';
import { MailVerificationService } from '@project-lc/nest-modules-mail';
import { SellerModule } from '@project-lc/nest-modules-seller';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginHistoryService } from './login-history/login-history.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

// jwtAuthGuard에서 auth service를 사용하고자 할 때, Global인 경우에만 auth Service에 접근 가능.
// 그렇지 않은 경우, 아래의 오류 발생
@Global()
@Module({
  imports: [SellerModule, BroadcasterModule, AdminModule, PassportModule],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    MailVerificationService,
    LoginHistoryService,
  ],
  controllers: [AuthController],
  exports: [MailVerificationService, AuthService, LoginHistoryService],
})
export class AuthModule {}
