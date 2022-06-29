/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import AppStarter from './app/app.starter';
import { ShutdownManager } from './app/shutdown.manager';

async function bootstrap(): Promise<void> {
  const bootstrapContext = '🚀 Application';
  const app = await NestFactory.createApplicationContext(AppModule);
  Logger.log(`Application started!!`, bootstrapContext);
  app.enableShutdownHooks();

  const appStarter = app.select(AppModule).get(AppStarter);

  const shutdownManager = app.select(AppModule).get(ShutdownManager);
  shutdownManager.subscribeToShutdown(async () =>
    app.close().then(() => {
      Logger.log(`Application termination completed. Goodbye`, bootstrapContext);
    }),
  );

  await appStarter.start();
}

bootstrap();
