import { DynamicModule, Module } from '@nestjs/common';
import { MailModule } from '@project-lc/nest-modules-mail';
import { S3Module } from '@project-lc/nest-modules-s3';
import { SellerContactsController } from './seller-contacts.controller';
import { SellerContactsService } from './seller-contacts.service';
import { SellerSettlementHistoryController } from './seller-settlement-history.controller';
import { SellerSettlementService } from './seller-settlement.service';
import { SellerShopService } from './seller-shop.service';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';

@Module({})
export class SellerModule {
  private static readonly providers = [
    SellerService,
    SellerSettlementService,
    SellerShopService,
    SellerContactsService,
  ];

  private static readonly exports = [SellerService, SellerSettlementService];

  private static readonly controllers = [
    SellerController,
    SellerContactsController,
    SellerSettlementHistoryController,
  ];

  private static readonly imports = [S3Module, MailModule];

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
