import { NestExpressApplication } from '@nestjs/platform-express';
import { colorizedMorganMiddleware } from '@project-lc/nest-modules';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import passport from 'passport';

export class AppSetting {
  private corsOptions = {
    origin: [
      'http://localhost:4200',
      'http://localhost:3011',
      'https://xn--hp4b17xa.com', // 크크쇼.com

      'https://seller.xn--hp4b17xa.com', // seller.크크쇼.com
      'https://xn--9z2b23wk2i.xn--hp4b17xa.com', // 판매자.크크쇼.com
      'https://admin.xn--hp4b17xa.com', // admin.크크쇼.com
      'https://dev-seller.xn--hp4b17xa.com', // dev-seller.크크쇼.com
      'https://dev-admin.xn--hp4b17xa.com', // dev-admin.크크쇼.com

      'https://project-lc-dev.vercel.app',
      'https://project-lc.vercel.app',
    ],
    credentials: true,
    exposedHeaders: ['X-wt-Access-Token'],
  };

  constructor(private readonly app: NestExpressApplication) {}

  public initialize(): void {
    this.app.use(helmet());
    this.app.use(cors(this.corsOptions));
    this.app.use(express.urlencoded({ limit: '50mb', extended: true }));
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(cookieParser('@#@$MYSIGN#@$#$'));
    this.app.use(colorizedMorganMiddleware);
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }
}
