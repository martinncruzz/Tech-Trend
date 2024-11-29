import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';

import { envs } from './config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Main');

  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.enableCors({ origin: envs.FRONTEND_URL });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  await app.listen(envs.PORT);
  logger.log(`Server running on port ${envs.PORT}`);
}
bootstrap();
