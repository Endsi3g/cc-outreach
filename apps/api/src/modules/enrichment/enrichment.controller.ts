import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { EnrichmentService } from './enrichment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Enrichment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('enrichment')
export class EnrichmentController {
  constructor(private readonly enrichmentService: EnrichmentService) {}

  @Post('company/:id')
  @ApiOperation({ summary: 'Trigger enrichment pipeline for a company' })
  async triggerEnrichment(@Param('id') id: string) {
    return this.enrichmentService.triggerEnrichment(id);
  }
}
