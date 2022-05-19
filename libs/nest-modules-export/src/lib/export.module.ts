import { Module, DynamicModule } from '@nestjs/common';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';

@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class ExportModule {
  private static readonly providers = [ExportService];

  private static readonly exports = [ExportService];

  private static readonly controllers = [ExportController];

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
