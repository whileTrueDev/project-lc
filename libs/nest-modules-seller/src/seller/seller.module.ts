import { DynamicModule, Module } from '@nestjs/common';
import { ImageResizer, UserPwManager } from '@project-lc/nest-core';
import { CipherModule } from '@project-lc/nest-modules-cipher';
import { MailVerificationModule } from '@project-lc/nest-modules-mail-verification';
import { SellerContactsController } from './seller-contacts.controller';
import { SellerContactsService } from './seller-contacts.service';
import { SellerSettlementHistoryController } from './seller-settlement-history.controller';
import { SellerSettlementInfoService } from './seller-settlement-info.service';
import { SellerShopService } from './seller-shop.service';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';
import SellerSettlementService from './settlement/seller-settlement.service';

@Module({})
export class SellerModule {
  private static readonly providers = [
    SellerService,
    SellerSettlementService,
    SellerSettlementInfoService,
    SellerShopService,
    SellerContactsService,
    UserPwManager,
    ImageResizer,
  ];

  private static readonly exports = [
    SellerService,
    SellerSettlementService,
    SellerSettlementInfoService,
  ];

  private static readonly controllers = [
    SellerController,
    SellerContactsController,
    SellerSettlementHistoryController,
  ];

  private static readonly imports = [MailVerificationModule, CipherModule];

  static withoutControllers(): DynamicModule {
    return {
      module: SellerModule,
      imports: this.imports,
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: SellerModule,
      controllers: this.controllers,
      imports: this.imports,
      providers: this.providers,
      exports: this.exports,
    };
  }
}
