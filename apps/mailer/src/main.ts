import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { colorizedMorganMiddleware } from '@project-lc/nest-core';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import { AppModule } from './app/app.module';

async function bootstrap(): Promise<void> {
  const PORT = process.env.PORT || 3003;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet());
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(express.json({ limit: '50mb' }));
  app.use(cookieParser('@#@$MYSIGN#@$#$'));
  app.use(colorizedMorganMiddleware);

  await app.listen(PORT, () =>
    Logger.log(`Mailer Server listening on http://localhost:${PORT}`),
  );
}

bootstrap();
