import { Module, DynamicModule } from '@nestjs/common';
import { OrderModule } from '@project-lc/nest-modules-order';
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

  private static readonly imports = [OrderModule.withoutControllers()];

  static withoutControllers(): DynamicModule {
    return {
      module: ExportModule,
      imports: this.imports,
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: ExportModule,
      imports: this.imports,
      providers: this.providers,
      exports: this.exports,
      controllers: this.controllers,
    };
  }
}
