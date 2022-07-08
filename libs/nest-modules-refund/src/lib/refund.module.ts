import { DynamicModule, Module } from '@nestjs/common';
import { CipherModule } from '@project-lc/nest-modules-cipher';
import { OrderModule } from '@project-lc/nest-modules-order';
import { PaymentModule } from '@project-lc/nest-modules-payment';
import { ReturnModule } from '@project-lc/nest-modules-return';
import { RefundController } from './refund.controller';
import { RefundService } from './refund.service';

@Module({})
export class RefundModule {
  private static readonly providers = [RefundService];

  private static readonly exports = [RefundService];
  private static readonly controllers = [RefundController];
  private static readonly imports = [
    OrderModule.withoutControllers(),
    PaymentModule.withoutControllers(),
    ReturnModule.withoutControllers(),
    CipherModule,
  ];

  static withoutControllers(): DynamicModule {
    return {
      module: RefundModule,
      providers: this.providers,
      exports: this.exports,
      imports: this.imports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: RefundModule,
      controllers: this.controllers,
      providers: this.providers,
      exports: this.exports,
      imports: this.imports,
    };
  }
}
