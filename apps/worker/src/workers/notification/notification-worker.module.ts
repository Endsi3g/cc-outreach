import { Module } from '@nestjs/common'; import { BullModule } from '@nestjs/bull'; import { NotificationWorkerProcessor } from './notification-worker.processor';
@Module({ imports: [BullModule.registerQueue({ name: 'notification.send' })], providers: [NotificationWorkerProcessor] })
export class NotificationWorkerModule {}
