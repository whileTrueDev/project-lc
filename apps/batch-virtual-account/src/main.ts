/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import VirtualAccountService from './app/virtual-account.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule);
  Logger.log(`Application started!!🚀 `);

  const service = app.select(AppModule).get(VirtualAccountService);

  app.close();
}

bootstrap();
