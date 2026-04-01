import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SearchService } from './search.service';

@ApiTags('search')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Recherche globale' })
  @ApiQuery({ name: 'q', required: true, type: String })
  search(@Query('q') q: string) {
    if (!q || q.length < 2) return { companies: [], contacts: [], leads: [] };
    return this.searchService.globalSearch(q);
  }
}
