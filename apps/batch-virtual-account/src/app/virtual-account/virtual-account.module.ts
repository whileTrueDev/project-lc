import { BullModule } from '@nestjs/bull';
import { DynamicModule, Module } from '@nestjs/common';
import { ShutdownManagerModule } from '../shutdown-manager/shutdown.manager.module';
import { QueueKey } from './virtual-account.constant';
import { VirtualAccountConsumer } from './virtual-account.consumer';
import { VirtualAccountProducer } from './virtual-account.producer';
import { VirtualAccountServiceProxy } from './virtual-account.proxy.service';
import VirtualAccountService from './virtual-account.service';

@Module({})
export class VirtualAccountModule {
  private static readonly imports = [
    ShutdownManagerModule.withoutControllers(),
    // A queue name is used as both an injection token
    //   (for injecting the queue into controllers/providers),
    // and as an argument to decorators to associate consumer classes
    //   and listeners with queues.
    BullModule.registerQueue({ name: QueueKey }),
  ];

  private static readonly providers = [
    VirtualAccountProducer,
    VirtualAccountService,
    VirtualAccountServiceProxy,
    VirtualAccountConsumer,
  ];

  private static readonly exports = [
    VirtualAccountProducer,
    // VirtualAccountService,
    VirtualAccountServiceProxy,
    VirtualAccountConsumer,
  ];

  private static readonly controllers = [];

  static withoutControllers(): DynamicModule {
    return {
      module: VirtualAccountModule,
      providers: this.providers,
      exports: this.exports,
      imports: this.imports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: VirtualAccountModule,
      controllers: this.controllers,
      providers: this.providers,
      exports: this.exports,
      imports: this.imports,
    };
  }
}
