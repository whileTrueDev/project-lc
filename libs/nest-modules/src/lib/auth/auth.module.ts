import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CipherService } from './cipher.service';

import { SellerModule } from '../seller/seller.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtConfigService } from './jwt.setting';
import { MailVerificationService } from './mailVerification.service';

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
