import { DynamicModule, Module } from '@nestjs/common';
import { OrderModule } from '@project-lc/nest-modules-order';
import { PaymentInfoController } from './payment-info.controller';
import { PaymentWebhookController } from './payment-webhook.controller';
import PaymentWebhookService from './payment-webhook.service';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({})
export class PaymentModule {
  private static providers = [PaymentService, PaymentWebhookService];

  private static controllers = [
    PaymentController,
    PaymentInfoController,
    PaymentWebhookController,
  ];

  private static exports = [PaymentService];

  private static imports = [OrderModule.withoutControllers()];

  static withoutControllers(): DynamicModule {
    return {
      module: PaymentModule,
      providers: this.providers,
      exports: this.exports,
      imports: this.imports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: PaymentModule,
      controllers: this.controllers,
      providers: this.providers,
      exports: this.exports,
      imports: this.imports,
    };
  }
}
