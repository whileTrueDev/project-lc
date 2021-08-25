import { Module, forwardRef, Global } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CipherService } from './cipher.service';

import { SellerModule } from '../seller/seller.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MailVerificationService } from './mailVerification.service';
import { JwtConfigService } from '../_nest-units/settings/jwt.setting';

// jwtAuthGuard에서 auth service를 사용하고자 할 때, Global인 경우에만 auth Service에 접근 가능.
// 그렇지 않은 경우, 아래의 오류 발생
// ERROR [ExceptionsHandler] Cannot read property 'validateRefreshToken' of undefined
// TypeError: Cannot read property 'validateRefreshToken' of undefined
@Global()
@Module({
  imports: [
    forwardRef(() => SellerModule),
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
  ],
  controllers: [AuthController],
  exports: [MailVerificationService, AuthService],
})
export class AuthModule {}
