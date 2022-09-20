import { DynamicModule, Module } from '@nestjs/common';
import { ImageResizer, UserPwManager } from '@project-lc/nest-core';
import { CipherModule } from '@project-lc/nest-modules-cipher';
import { MailVerificationModule } from '@project-lc/nest-modules-mail-verification';
import { PrismaModule } from '@project-lc/prisma-orm';
import { BroadcasterChannelService } from './broadcaster-channel.service';
import { BroadcasterContactsController } from './broadcaster-contacts.controller';
import { BroadcasterContactsService } from './broadcaster-contacts.service';
import { BroadcasterPromotionPageContoller } from './broadcaster-promotion-page.controller';
import { BroadcasterPromotionPageService } from './broadcaster-promotion-page.service';
import { BroadcasterController } from './broadcaster.controller';
import { BroadcasterService } from './broadcaster.service';
import { BroadcasterSettlementHistoryController } from './settlement-history/broadcaster-settlement-history.controller';
import { BroadcasterSettlementHistoryService } from './settlement-history/broadcaster-settlement-history.service';
import { BroadcasterSettlementInfoController } from './settlement-info/broadcaster-settlement-info.controller';
import { BroadcasterSettlementInfoService } from './settlement-info/broadcaster-settlement-info.service';
import { BroadcasterSettlementController } from './settlement/broadcaster-settlement.controller';
import { BroadcasterSettlementService } from './settlement/broadcaster-settlement.service';

@Module({})
export class BroadcasterModule {
  private static readonly providers = [
    BroadcasterService,
    BroadcasterContactsService,
    BroadcasterChannelService,
    BroadcasterSettlementHistoryService,
    BroadcasterSettlementInfoService,
    BroadcasterSettlementService,
    BroadcasterPromotionPageService,
    UserPwManager,
    ImageResizer,
  ];

  private static readonly exports = [
    BroadcasterService,
    BroadcasterChannelService,
    BroadcasterSettlementHistoryService,
    BroadcasterSettlementService,
    BroadcasterSettlementInfoService,
    BroadcasterSettlementHistoryService,
    BroadcasterPromotionPageService,
  ];

  private static readonly controllers = [
    BroadcasterController,
    BroadcasterContactsController,
    BroadcasterSettlementController,
    BroadcasterSettlementInfoController,
    BroadcasterSettlementHistoryController,
    BroadcasterPromotionPageContoller,
  ];

  private static readonly imports = [PrismaModule, CipherModule, MailVerificationModule];

  static withoutControllers(): DynamicModule {
    return {
      module: BroadcasterModule,
      imports: this.imports,
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: BroadcasterModule,
      controllers: this.controllers,
      imports: this.imports,
      providers: this.providers,
      exports: this.exports,
    };
  }
}
