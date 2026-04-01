import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ObservabilityService {
  private readonly logger = new Logger(ObservabilityService.name);

  logJobExecution(jobName: string, success: boolean, duration: number) {
    this.logger.log(`Job ${jobName} executed: ${success ? 'SUCCESS' : 'FAILED'} in ${duration}ms`);
  }

  getGmailQuotas() {
    // Placeholder for Gmail quota monitoring
    return {
      dailyLimit: 2000,
      remaining: 1850,
      resetIn: '4h 20m',
    };
  }
}
