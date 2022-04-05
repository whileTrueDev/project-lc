import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppMailService } from './app/app-mail.service';
import { AppModule } from './app/app.module';
import { AppService } from './app/app.service';

async function bootstrap(): Promise<void> {
  const logger: Logger = new Logger('MailerTaskService');

  const app = await NestFactory.createApplicationContext(AppModule);

  const appService = app.get(AppService);
  const appMailService = app.get(AppMailService);

  app.enableShutdownHooks();

  // 대상 검색 시작
  logger.log('Start: Searching Login History');
  const mailTargets = await appService.getLastLoginDate();
  logger.log('Finish: Searching Login History');

  await Promise.all([
    mailTargets.map((user) => {
      if (user.timeDiff === 366) {
        return appService.moveInactiveUserData(user);
      }
      return null;
    }),
    appMailService.sendMail(mailTargets),
  ]);

  logger.log('Job Done');

  await app.close();
}

bootstrap();
