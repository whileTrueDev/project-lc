import { DynamicModule, Module } from '@nestjs/common';
import { KkshowBcListController } from './kkshow-bc-list.controller';
import { KkshowBcListService } from './kkshow-bc-list.service';

@Module({})
export class KkshowBcListModule {
  private static readonly providers = [KkshowBcListService];
  private static readonly controllers = [KkshowBcListController];
  private static readonly imports = [];
  private static readonly exports = [KkshowBcListService];

  static withoutControllers(): DynamicModule {
    return {
      module: KkshowBcListModule,
      imports: this.imports,
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: KkshowBcListModule,
      imports: this.imports,
      controllers: this.controllers,
      providers: this.providers,
      exports: this.exports,
    };
  }
}
