import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

import { CustomExceptionFilter } from '@modules/shared/exceptions/custom-exception.filter';
import { envs } from '@config/adapters/envs.adapter';
import { PostgresDatabase } from '@database/postgres/postgres-database';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Main');

  await PostgresDatabase.connect();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });

  app.enableCors({ origin: envs.FRONTEND_URL });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.useGlobalFilters(new CustomExceptionFilter());

  await app.listen(envs.PORT);
  logger.log(`Server running on port ${envs.PORT}`);
}
bootstrap();
