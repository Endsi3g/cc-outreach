import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { ScoringService } from './scoring.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Scoring')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('scoring')
export class ScoringController {
  constructor(private readonly service: ScoringService) {}

  @Post(':companyId/compute')
  @ApiOperation({ summary: 'Trigger scoring pipeline' })
  async trigger(@Param('companyId') companyId: string) {
    return this.service.trigger(companyId);
  }
}
