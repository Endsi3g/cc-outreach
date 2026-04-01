import { Module } from '@nestjs/common'; import { BullModule } from '@nestjs/bull'; import { OutreachWorkerProcessor } from './outreach-worker.processor';
@Module({ imports: [BullModule.registerQueue({ name: 'outreach.generate' })], providers: [OutreachWorkerProcessor] })
export class OutreachWorkerModule {}
