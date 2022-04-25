import { Module, DynamicModule } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({})
export class PaymentModule {
  private static providers = [PaymentService];

  private static controllers = [PaymentController];
  private static exports = [];

  static withoutControllers(): DynamicModule {
    return {
      module: PaymentModule,
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: PaymentModule,
      controllers: this.controllers,
      providers: this.providers,
      exports: this.exports,
    };
  }
}
