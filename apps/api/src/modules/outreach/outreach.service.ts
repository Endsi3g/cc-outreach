import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class OutreachService {
  private readonly logger = new Logger(OutreachService.name);

  constructor(@InjectQueue('outreach.generate') private readonly queue: Queue) {}

  async trigger(leadId: string) {
    this.logger.log(`Triggering outreach draft for: ${leadId}`);
    await this.queue.add({ leadId }, { attempts: 3, removeOnComplete: true });
    return { success: true, leadId, message: 'Outreach generation queued successfully' };
  }
}
