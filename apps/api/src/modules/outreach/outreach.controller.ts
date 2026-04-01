import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { OutreachService } from './outreach.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Outreach')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('outreach')
export class OutreachController {
  constructor(private readonly service: OutreachService) {}

  @Post(':leadId/generate')
  @ApiOperation({ summary: 'Trigger outreach generation pipeline' })
  async trigger(@Param('leadId') leadId: string) {
    return this.service.trigger(leadId);
  }
}
