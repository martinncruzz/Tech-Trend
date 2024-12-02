import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';

import { envs } from './config';
import { CustomExceptionFilter } from './modules';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Main');

  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.enableCors({ origin: envs.FRONTEND_URL });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.useGlobalFilters(new CustomExceptionFilter());

  await app.listen(envs.PORT);
  logger.log(`Server running on port ${envs.PORT}`);
}
bootstrap();
