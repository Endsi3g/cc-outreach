import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { WebsiteAuditService } from './website-audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('WebsiteAudit')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('website-audit')
export class WebsiteAuditController {
  constructor(private readonly service: WebsiteAuditService) {}

  @Post('trigger')
  @ApiOperation({ summary: 'Trigger website audit pipeline' })
  async trigger(@Body() body: { companyId: string; url: string }) {
    return this.service.trigger(body.companyId, body.url);
  }
}
