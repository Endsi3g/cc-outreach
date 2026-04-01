import { Module } from '@nestjs/common'; import { BullModule } from '@nestjs/bull';
const QUEUE_NAMES = ['enrichment.company','audit.website','scoring.compute','outreach.generate','gmail.send','gmail.sync','notification.send','analytics.aggregate'];
@Module({ imports: QUEUE_NAMES.map(name => BullModule.registerQueue({ name })), exports: QUEUE_NAMES.map(() => BullModule) })
export class JobsModule {}
