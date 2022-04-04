import { DynamicModule, Module } from '@nestjs/common';
import { KkshowSearchService } from './kkshow-search.service';
import { KkshowSearchController } from './kkshow-search.controller';

@Module({})
export class KkshowSearchModule {
  private static readonly providers = [KkshowSearchService];

  private static readonly exports = [KkshowSearchService];

  private static readonly controllers = [KkshowSearchController];

  static withoutControllers(): DynamicModule {
    return {
      module: KkshowSearchModule,
      imports: [],
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: KkshowSearchModule,
      imports: [],
      providers: this.providers,
      exports: this.exports,
      controllers: this.controllers,
    };
  }
}
