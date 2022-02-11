import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AppService } from './app/app.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule);
  const appService = app.get(AppService);
  const mailTargets = await appService.getLastLoginDate();

  // 계정 분리
  mailTargets.forEach((user) => {
    if (user.timeDiff === 366) {
      appService.moveInactiveUserData(user);
    }
  });

  // 메일 전송
  appService.sendMail(mailTargets);
  // mailTargets에겐 메일을 보내야 함
}
bootstrap();
