import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ActivitiesService } from './activities.service';

@ApiTags('activities')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activities: ActivitiesService) {}

  @Get('leads/:leadId')
  @ApiOperation({ summary: 'Historique d\'activités d\'un lead' })
  byLead(@Param('leadId') leadId: string, @Query('limit') limit = 50) {
    return this.activities.findByLead(leadId, Number(limit));
  }
}
