import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap(): Promise<void> {
  const PORT = 3003;
  const app = await NestFactory.create(AppModule);
  app
    .listen(PORT)
    .then(() => console.log(`Mailer Server listening on http://localhost:${PORT}`));
}

bootstrap();
