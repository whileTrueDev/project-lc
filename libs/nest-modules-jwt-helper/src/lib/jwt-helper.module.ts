import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from '@project-lc/nest-core';
import { CipherModule } from '@project-lc/nest-modules-cipher';
import { JwtHelperService } from './jwt-helper.service';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    CipherModule,
  ],
  providers: [JwtHelperService],
  exports: [JwtHelperService],
})
export class JwtHelperModule {}
