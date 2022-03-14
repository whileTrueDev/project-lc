import { Module } from '@nestjs/common';
import { MailModule } from '@project-lc/nest-modules-mail';
import { AppController } from './app.controller';

@Module({
  imports: [MailModule],
  controllers: [AppController],
})
export class AppModule {}
