import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ScoringService {
  private readonly logger = new Logger(ScoringService.name);

  constructor(@InjectQueue('scoring.compute') private readonly queue: Queue) {}

  async trigger(companyId: string) {
    this.logger.log(`Triggering scoring for: ${companyId}`);
    await this.queue.add({ companyId }, { attempts: 3, removeOnComplete: true });
    return { success: true, companyId, message: 'Scoring compute queued successfully' };
  }
}
