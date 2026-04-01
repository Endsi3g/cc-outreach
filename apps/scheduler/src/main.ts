import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SchedulerAppModule } from './scheduler-app.module';

async function bootstrap() {
  const logger = new Logger('Scheduler');
  const app = await NestFactory.create(SchedulerAppModule, { bufferLogs: true });
  const port = process.env.SCHEDULER_PORT ?? 3002;
  await app.listen(port);
  logger.log(`Scheduler démarré sur http://localhost:${port}`);
}

bootstrap();
