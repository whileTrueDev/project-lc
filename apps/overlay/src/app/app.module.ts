import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheConfig } from '@project-lc/nest-core';
import { CipherModule } from '@project-lc/nest-modules-cipher';
import { OverlayModule } from '@project-lc/nest-modules-overlay';
import { PrismaModule } from '@project-lc/prisma-orm';
import { validationSchema } from '../settings/config.validation';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema }),
    PrismaModule,
    CacheModule.registerAsync({ isGlobal: true, useClass: CacheConfig }),
    CipherModule,
    OverlayModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
