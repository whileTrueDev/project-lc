import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MailVerificationService } from './mail-verification.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MAILER_MQ',
        transport: Transport.REDIS,
        options: { url: 'redis://localhost:6399' },
      },
    ]),
  ],
  providers: [MailVerificationService],
  exports: [MailVerificationService],
})
export class MailVerificationModule {}
