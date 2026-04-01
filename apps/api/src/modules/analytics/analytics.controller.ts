import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get('global')
  @ApiOperation({ summary: 'Obtenir les statistiques globales de prospection' })
  getGlobal() {
    return this.analytics.getGlobalStats();
  }

  @Get('pipeline')
  @ApiOperation({ summary: 'Répartition des leads par étape du pipeline' })
  getPipeline() {
    return this.analytics.getPipelineStats();
  }

  @Get('niches')
  @ApiOperation({ summary: 'Répartition des entreprises par niche' })
  getNiches() {
    return this.analytics.getNicheStats();
  }

  @Get('activities')
  @ApiOperation({ summary: 'Journal des activités récentes' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  getActivities(@Query('days') days = 7) {
    return this.analytics.getDailyActivities(Number(days));
  }
}
