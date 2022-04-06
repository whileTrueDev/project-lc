import { DynamicModule, Module } from '@nestjs/common';
import { ManualController } from './manual.controller';
import { ManualService } from './manual.service';

@Module({})
export class ManualModule {
  private static readonly providers = [ManualService];

  private static readonly exports = [ManualService];

  private static readonly controllers = [ManualController];

  static withoutControllers(): DynamicModule {
    return {
      module: ManualModule,
      imports: [],
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: ManualModule,
      imports: [],
      providers: this.providers,
      exports: this.exports,
      controllers: this.controllers,
    };
  }
}
