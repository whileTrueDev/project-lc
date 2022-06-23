import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@project-lc/prisma-orm';
import { validationSchema } from '../settings/config.validation';
import AppStarter from './app.starter';
import { BullConfigService } from './bull.config';
import { ShutdownManager } from './shutdown.manager';
import { QueueKey } from './virtual-account.constant';
import { VirtualAccountConsumer } from './virtual-account.consumer';
import { VirtualAccountProducer } from './virtual-account.producer';
import { VirtualAccountServiceProxy } from './virtual-account.proxy.service';
import VirtualAccountService from './virtual-account.service';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true, validationSchema }),
    BullModule.forRootAsync({ useClass: BullConfigService }),
    // A queue name is used as both an injection token
    //   (for injecting the queue into controllers/providers),
    // and as an argument to decorators to associate consumer classes
    //   and listeners with queues.
    BullModule.registerQueue({ name: QueueKey }),
  ],
  providers: [
    AppStarter,
    VirtualAccountProducer,
    VirtualAccountService,
    VirtualAccountServiceProxy,
    VirtualAccountConsumer,
    ShutdownManager,
  ],
})
export class AppModule {}
