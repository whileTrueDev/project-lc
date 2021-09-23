import { Module } from '@nestjs/common';
import { PrismaModule } from '@project-lc/prisma-orm';
import { OverlayControllerService } from '@project-lc/nest-modules';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { validationSchema } from '../settings/config.validation';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({ isGlobal: true, validationSchema })],
  controllers: [AppController],
  providers: [OverlayControllerService, ConfigService],
})
export class AppModule {}
