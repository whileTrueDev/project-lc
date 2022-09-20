import { DynamicModule, Module } from '@nestjs/common';
import { ImageResizer, UserPwManager } from '@project-lc/nest-core';
import { CouponModule } from '@project-lc/nest-modules-coupon';
import { MailVerificationModule } from '@project-lc/nest-modules-mail-verification';
import { CustomerAddressController } from './address/customer-address.controller';
import { CustomerAddressService } from './address/customer-address.service';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({})
export class CustomerModule {
  private static readonly providers = [
    UserPwManager,
    CustomerService,
    CustomerAddressService,
    ImageResizer,
  ];

  private static readonly exports = [CustomerService];

  private static readonly controllers = [CustomerController, CustomerAddressController];

  private static readonly imports = [
    MailVerificationModule,
    CouponModule.withoutControllers(),
  ];

  static withoutControllers(): DynamicModule {
    return {
      module: CustomerModule,
      imports: this.imports,
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: CustomerModule,
      controllers: this.controllers,
      imports: this.imports,
      providers: this.providers,
      exports: this.exports,
    };
  }
}
