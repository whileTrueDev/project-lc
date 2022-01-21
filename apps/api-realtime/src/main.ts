import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RedisIoAdapter } from '@project-lc/nest-core';
import { AppModule } from './app/app.module';
import { AppSetting } from './settings/appSetting';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.enableCors();
  app.useWebSocketAdapter(new RedisIoAdapter(app));

  const appsetting = new AppSetting(app);
  appsetting.initialize();

  const port = process.env.PORT || 3001;
  await app.listen(port, () => {
    Logger.log(`Listening at http://localhost:${port}`);
  });
}

bootstrap();
