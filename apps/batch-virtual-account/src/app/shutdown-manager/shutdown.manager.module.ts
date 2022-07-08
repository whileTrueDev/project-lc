import { DynamicModule, Module } from '@nestjs/common';
import { ShutdownManager } from './shutdown.manager';

@Module({})
export class ShutdownManagerModule {
  private static readonly imports = [];
  private static readonly providers = [ShutdownManager];
  private static readonly exports = [ShutdownManager];
  private static readonly controllers = [];

  static withoutControllers(): DynamicModule {
    return {
      module: ShutdownManagerModule,
      providers: this.providers,
      exports: this.exports,
      imports: this.imports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: ShutdownManagerModule,
      controllers: this.controllers,
      providers: this.providers,
      exports: this.exports,
      imports: this.imports,
    };
  }
}
