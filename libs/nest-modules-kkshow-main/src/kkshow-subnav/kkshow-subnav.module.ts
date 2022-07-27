import { DynamicModule, Module } from '@nestjs/common';
import { KkshowSubNavController } from './kkshow-subnav.controller';
import { KkshowSubNavService } from './kkshow-subnav.service';

@Module({})
export class KkshowSubNavModule {
  private static readonly providers = [KkshowSubNavService];

  private static readonly exports = [KkshowSubNavService];

  private static readonly controllers = [KkshowSubNavController];

  static withoutControllers(): DynamicModule {
    return {
      module: KkshowSubNavModule,
      imports: [],
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: KkshowSubNavModule,
      imports: [],
      providers: this.providers,
      exports: this.exports,
      controllers: this.controllers,
    };
  }
}
