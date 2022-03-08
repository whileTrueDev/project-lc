import { DynamicModule, Module } from '@nestjs/common';
import { KkshowMainService } from './kkshow-main.service';
import { KkshowMainController } from './kkshow-main.controller';

@Module({})
export class KkshowMainModule {
  private static readonly providers = [KkshowMainService];

  private static readonly exports = [KkshowMainService];

  private static readonly controllers = [KkshowMainController];

  static withoutControllers(): DynamicModule {
    return {
      module: KkshowMainModule,
      imports: [],
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: KkshowMainModule,
      imports: [],
      providers: this.providers,
      exports: this.exports,
      controllers: this.controllers,
    };
  }
}
