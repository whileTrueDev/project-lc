import { Module, DynamicModule } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({})
export class PaymentsModule {
  private static providers = [PaymentsService];

  private static controllers = [PaymentsController];
  private static exports = [];

  static withoutControllers(): DynamicModule {
    return {
      module: PaymentsModule,
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: PaymentsModule,
      controllers: this.controllers,
      providers: this.providers,
      exports: this.exports,
    };
  }
}
