/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RedisIoAdapter } from '@project-lc/nest-core';
import { AppModule } from './app/app.module';
import { AppSetting } from './settings/appSetting';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const websocketAdapter = new RedisIoAdapter();
  app.useWebSocketAdapter(websocketAdapter);

  const appsetting = new AppSetting(app);
  appsetting.initialize();

  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    if (!['production', 'test'].includes(process.env.NODE_ENV)) {
      Logger.log(`Server Listening at http://localhost:${port}`);
    }
  });
}

bootstrap();
