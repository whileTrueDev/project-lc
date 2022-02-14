import { NestExpressApplication } from '@nestjs/platform-express';
import {
  colorizedMorganMiddleware,
  corsOptions,
  csrfConfig,
} from '@project-lc/nest-core';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import csrf from 'csurf';
import express from 'express';
import helmet from 'helmet';
import passport from 'passport';

export class AppSetting {
  constructor(private readonly app: NestExpressApplication) {}

  public initialize(): void {
    this.app.use(helmet());
    this.app.use(cors(corsOptions));
    this.app.use(express.urlencoded({ limit: '50mb', extended: true }));
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(cookieParser('@#@$MYSIGN#@$#$'));
    this.app.use(csrf(csrfConfig));
    this.app.use(colorizedMorganMiddleware);
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }
}
