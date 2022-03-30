import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICE_MAILER_TOKEN } from '@project-lc/nest-core';
import { MailVerificationService } from './mail-verification.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICROSERVICE_MAILER_TOKEN,
        transport: Transport.REDIS,
        options: { url: process.env.MQ_REDIS_URL || 'redis://localhost:6399' },
      },
    ]),
  ],
  providers: [MailVerificationService],
  exports: [MailVerificationService],
})
export class MailVerificationModule {}
