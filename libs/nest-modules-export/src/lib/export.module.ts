import { Module, DynamicModule } from '@nestjs/common';

@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class ExportModule {
  private static readonly providers = [];

  private static readonly exports = [];

  private static readonly controllers = [];

  static withoutControllers(): DynamicModule {
    return {
      module: ExportModule,
      imports: [],
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: ExportModule,
      imports: [],
      providers: this.providers,
      exports: this.exports,
      controllers: this.controllers,
    };
  }
}
