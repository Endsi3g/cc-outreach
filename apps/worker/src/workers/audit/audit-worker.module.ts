import { Module } from '@nestjs/common'; import { BullModule } from '@nestjs/bull'; import { AuditWorkerProcessor } from './audit-worker.processor';
@Module({ imports: [BullModule.registerQueue({ name: 'audit.website' })], providers: [AuditWorkerProcessor] })
export class AuditWorkerModule {}
