import { DynamicModule, Module } from '@nestjs/common';
import { CipherModule } from '@project-lc/nest-modules-cipher';
import { MailVerificationModule } from '@project-lc/nest-modules-mail-verification';
import { PrismaModule } from '@project-lc/prisma-orm';
import { BroadcasterChannelService } from './broadcaster-channel.service';
import { BroadcasterContactsController } from './broadcaster-contacts.controller';
import { BroadcasterContactsService } from './broadcaster-contacts.service';
import { BroadcasterPromotionPageService } from './broadcaster-promotion-page.service';
import { BroadcasterSettlementHistoryController } from './broadcaster-settlement-history.controller';
import { BroadcasterSettlementHistoryService } from './broadcaster-settlement-history.service';
import { BroadcasterSettlementController } from './broadcaster-settlement.controller';
import { BroadcasterSettlementService } from './broadcaster-settlement.service';
import { BroadcasterController } from './broadcaster.controller';
import { BroadcasterService } from './broadcaster.service';

@Module({})
export class BroadcasterModule {
  private static readonly providers = [
    BroadcasterService,
    BroadcasterContactsService,
    BroadcasterChannelService,
    BroadcasterSettlementHistoryService,
    BroadcasterSettlementService,
    BroadcasterPromotionPageService,
  ];

  private static readonly exports = [
    BroadcasterService,
    BroadcasterChannelService,
    BroadcasterSettlementHistoryService,
    BroadcasterSettlementService,
    BroadcasterSettlementHistoryService,
    BroadcasterPromotionPageService,
  ];

  private static readonly controllers = [
    BroadcasterController,
    BroadcasterContactsController,
    BroadcasterSettlementController,
    BroadcasterSettlementHistoryController,
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
