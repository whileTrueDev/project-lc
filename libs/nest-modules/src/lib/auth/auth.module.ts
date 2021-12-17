import { forwardRef, Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { BroadcasterModule } from '../broadcaster/broadcaster.module';
import { SellerModule } from '../seller/seller.module';
import { AdminModule } from '../admin/admin.module';
import { JwtConfigService } from '../_nest-units/settings/jwt.setting';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CipherService } from './cipher.service';
import { LoginHistoryService } from './login-history/login-history.service';
import { MailVerificationService } from './mailVerification.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

// jwtAuthGuard에서 auth service를 사용하고자 할 때, Global인 경우에만 auth Service에 접근 가능.
// 그렇지 않은 경우, 아래의 오류 발생
// ERROR [ExceptionsHandler] Cannot read property 'validateRefreshToken' of undefined
// TypeError: Cannot read property 'validateRefreshToken' of undefined
@Global()
@Module({
  imports: [
    forwardRef(() => SellerModule),
    forwardRef(() => BroadcasterModule),
    forwardRef(() => AdminModule),
    PassportModule,
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
  ],
  providers: [
    AuthService,
    CipherService,
    JwtStrategy,
    LocalStrategy,
    MailVerificationService,
    LoginHistoryService,
  ],
  controllers: [AuthController],
  exports: [MailVerificationService, AuthService, LoginHistoryService, CipherService],
})
export class AuthModule {}
