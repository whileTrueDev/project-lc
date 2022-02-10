import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AppService } from './app/app.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const appService = app.get(AppService);
  console.log(appService.getHello());
}
bootstrap();
