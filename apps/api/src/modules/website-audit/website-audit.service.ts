import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class WebsiteAuditService {
  private readonly logger = new Logger(WebsiteAuditService.name);

  constructor(@InjectQueue('audit.website') private readonly queue: Queue) {}

  async trigger(companyId: string, url: string) {
    this.logger.log(`Triggering website audit for: ${companyId} - ${url}`);
    await this.queue.add({ companyId, url }, { attempts: 3, removeOnComplete: true });
    return { success: true, companyId, message: 'Website Audit queued successfully' };
  }
}
