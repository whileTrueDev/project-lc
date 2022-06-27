import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { colorizedMorganMiddleware } from '@project-lc/nest-core';
import cookieParser from 'cookie-parser';

export class AppSetting {
  constructor(private readonly app: NestExpressApplication) {}

  public initialize(): void {
    this.app.useStaticAssets(join(__dirname, 'public'));
    this.app.useStaticAssets(join(__dirname, 'assets'));
    this.app.useStaticAssets(join(__dirname, 'lib'));
    this.app.setBaseViewsDir(join(__dirname, 'views'));

    this.app.use(cookieParser());
    this.app.setViewEngine('hbs');
    this.app.enableCors();
    this.app.use(colorizedMorganMiddleware);
  }
}
