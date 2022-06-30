import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@project-lc/prisma-orm';
import { validationSchema } from '../settings/config.validation';
import AppStarter from './app.starter';
import { BullConfig } from './bull.config';
import { ShutdownManagerModule } from './shutdown-manager/shutdown.manager.module';
import { VirtualAccountModule } from './virtual-account/virtual-account.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema }),
    BullModule.forRootAsync({ useClass: BullConfig }),
    PrismaModule,
    ShutdownManagerModule.withoutControllers(),
    VirtualAccountModule.withoutControllers(),
  ],
  providers: [AppStarter],
})
export class AppModule {}
