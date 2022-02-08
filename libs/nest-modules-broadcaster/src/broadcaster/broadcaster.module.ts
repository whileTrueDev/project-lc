import { DynamicModule, Module } from '@nestjs/common';
import { MailModule } from '@project-lc/nest-modules-mail';
import { S3Module } from '@project-lc/nest-modules-s3';
import { PrismaModule } from '@project-lc/prisma-orm';
import { CipherModule } from '@project-lc/nest-modules-cipher';
import { BroadcasterChannelService } from './broadcaster-channel.service';
import { BroadcasterContactsService } from './broadcaster-contacts.service';
import { BroadcasterSettlementHistoryService } from './broadcaster-settlement-history.service';
import { BroadcasterSettlementService } from './broadcaster-settlement.service';
import { BroadcasterController } from './broadcaster.controller';
import { BroadcasterService } from './broadcaster.service';
import { BroadcasterPurchaseService } from './broadcaster-purchase.service';

@Module({})
export class BroadcasterModule {
  private static readonly providers = [
    BroadcasterService,
    BroadcasterContactsService,
    BroadcasterChannelService,
    BroadcasterSettlementHistoryService,
    BroadcasterSettlementService,
    BroadcasterPurchaseService,
  ];

  private static readonly exports = [
    BroadcasterService,
    BroadcasterChannelService,
    BroadcasterSettlementHistoryService,
    BroadcasterSettlementService,
    BroadcasterSettlementHistoryService,
    BroadcasterPurchaseService,
  ];

  private static readonly controllers = [BroadcasterController];
  private static readonly imports = [PrismaModule, S3Module, MailModule, CipherModule];

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
