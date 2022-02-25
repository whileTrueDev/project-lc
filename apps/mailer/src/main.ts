import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { AppService } from './app/app.service';

async function bootstrap(): Promise<void> {
  const logger: Logger = new Logger('MailerTaskService');

  const app = await NestFactory.createApplicationContext(AppModule);

  app.enableShutdownHooks();

  const appService = app.get(AppService);

  // 대상 검색 시작
  logger.log('Start: Searching Login History');
  const mailTargets = await appService.getLastLoginDate();
  logger.log('Finish: Searching Login History');

  // 계정 분리
  logger.log('Start: Moving Target Data');
  mailTargets.forEach((user) => {
    if (user.timeDiff === 366) {
      appService.moveInactiveUserData(user);
    }
  });
  logger.log('Finish: Moving Target Data');

  // 메일 전송
  logger.log('Start: To Send Email');
  appService.sendMail(mailTargets);
  logger.log('Finish: To Send Email');

  logger.log('Finish: Job Done');

  await app.close();
}

bootstrap();
