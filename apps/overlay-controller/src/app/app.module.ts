import { Module } from '@nestjs/common';
import { PrismaModule } from '@project-lc/prisma-orm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OverlayControllerModule } from '@project-lc/nest-modules';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validationSchema } from '../settings/config.validation';

@Module({
  imports: [
    PrismaModule,
    OverlayControllerModule,
    ConfigModule.forRoot({ isGlobal: true, validationSchema }),
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
