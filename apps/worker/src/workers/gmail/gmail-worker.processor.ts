import { Processor, Process } from '@nestjs/bull'; import { Logger } from '@nestjs/common'; import { Job } from 'bull';
@Processor('gmail.send')
export class GmailWorkerProcessor {
  private readonly logger = new Logger(GmailWorkerProcessor.name);
  @Process()
  async handle(job: Job<{ draftId: string }>) {
    this.logger.log(`[gmail.send] Envoi draftId=${job.data.draftId}`);
    // TODO: Gmail API send + quota check + thread sync
  }
}
