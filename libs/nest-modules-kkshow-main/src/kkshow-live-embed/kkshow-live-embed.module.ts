import { DynamicModule, Module } from '@nestjs/common';
import { KkshowLiveEmbedController } from './kkshow-live-embed.controller';
import { KkshowLiveEmbedService } from './kkshow-live-embed.service';

@Module({})
export class KkshowLiveEmbedModule {
  private static readonly providers = [KkshowLiveEmbedService];

  private static readonly exports = [KkshowLiveEmbedService];

  private static readonly controllers = [KkshowLiveEmbedController];

  private static readonly imports = [];

  static withoutControllers(): DynamicModule {
    return {
      module: KkshowLiveEmbedModule,
      imports: this.imports,
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: KkshowLiveEmbedModule,
      imports: this.imports,
      providers: this.providers,
      exports: this.exports,
      controllers: this.controllers,
    };
  }
}
