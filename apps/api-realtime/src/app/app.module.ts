import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtHelperModule } from '@project-lc/nest-modules-jwt-helper';
import { NotificationRealtimeModule } from '@project-lc/nest-modules-notification';
import { validationSchema } from '../settings/config.validation';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema }),
    NotificationRealtimeModule,
    JwtHelperModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
