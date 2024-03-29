/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';
import { AppSetting } from './settings/appSetting';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const appsetting = new AppSetting(app);
  appsetting.initialize();

  const port = process.env.PORT || 3002;

  app.connectMicroservice({
    transport: Transport.REDIS,
    options: { url: process.env.MQ_REDIS_URL || 'redis://localhost:6399' },
  });
  await app.startAllMicroservices();
  await app.listen(port, () => {
    Logger.log(`Listening at http://localhost:${port}`);
  });
}

bootstrap();
