import { DynamicModule, Module } from '@nestjs/common';
import { ExportModule } from '@project-lc/nest-modules-export';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';

@Module({ controllers: [], providers: [], exports: [] })
export class DeliveryModule {
  private static readonly providers = [DeliveryService];
  private static readonly exports = [DeliveryService];
  private static readonly controllers = [DeliveryController];
  private static readonly imports = [ExportModule.withoutControllers()];

  static withoutControllers(): DynamicModule {
    return {
      module: DeliveryModule,
      imports: this.imports,
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: DeliveryModule,
      imports: this.imports,
      providers: this.providers,
      exports: this.exports,
      controllers: this.controllers,
    };
  }
}
