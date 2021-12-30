import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from '@project-lc/nest-core';
import { JwtHelperService } from './jwt-helper.service';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
  ],
  providers: [JwtHelperService],
  exports: [JwtHelperService],
})
export class JwtHelperModule {}
