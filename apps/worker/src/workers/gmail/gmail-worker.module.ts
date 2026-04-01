import { Module } from '@nestjs/common'; import { BullModule } from '@nestjs/bull'; import { GmailWorkerProcessor } from './gmail-worker.processor';
@Module({ imports: [BullModule.registerQueue({ name: 'gmail.send' }, { name: 'gmail.sync' })], providers: [GmailWorkerProcessor] })
export class GmailWorkerModule {}
