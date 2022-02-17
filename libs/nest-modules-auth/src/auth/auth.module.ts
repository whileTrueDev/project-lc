import { Global, Module } from '@nestjs/common';
import { AdminModule } from '@project-lc/nest-modules-admin';
import { BroadcasterModule } from '@project-lc/nest-modules-broadcaster';
import { MailModule } from '@project-lc/nest-modules-mail';
import { SellerModule } from '@project-lc/nest-modules-seller';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginHistoryService } from './login-history/login-history.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Global()
@Module({
  imports: [
    SellerModule.withoutControllers(),
    BroadcasterModule.withoutControllers(),
    AdminModule.withoutControllers(),
    MailModule,
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy, LoginHistoryService],
  controllers: [AuthController],
  exports: [AuthService, LoginHistoryService],
})
export class AuthModule {}
