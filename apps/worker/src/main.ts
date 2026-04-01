import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { WorkerAppModule } from './worker-app.module';

async function bootstrap() {
  const logger = new Logger('Worker');
  const app = await NestFactory.create(WorkerAppModule, { bufferLogs: true });
  const port = process.env.WORKER_PORT ?? 3001;
  await app.listen(port);
  logger.log(`Worker démarré sur http://localhost:${port}`);
}

bootstrap();
