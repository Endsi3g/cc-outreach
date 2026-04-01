import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { WebsiteAuditController } from './website-audit.controller';
import { WebsiteAuditService } from './website-audit.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'audit.website' }),
  ],
  controllers: [WebsiteAuditController],
  providers: [WebsiteAuditService],
  exports: [WebsiteAuditService],
})
export class WebsiteAuditModule {}
