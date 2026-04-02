import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { IsString, IsOptional } from 'class-validator';
import { CompaniesService } from './companies.service';
import { WorkspaceMemberGuard } from '../auth/guards/workspace-member.guard';
import { WorkspaceId } from '../auth/decorators/workspace-id.decorator';

// Enums as string unions instead of imported enum values (avoids TS enum-as-value error pre-generate)
const NICHES = ['CONSTRUCTION','TOITURE','EXCAVATION','HVAC','ELECTRICITE','PLOMBERIE','PORTES_FENETRES','RENOVATION','PAYSAGEMENT','OTHER'] as const;
const REGIONS = ['MONTREAL','LAVAL','RIVE_SUD','RIVE_NORD','QUEBEC_CITY','ESTRIE','LANAUDIERE','OUTAOUAIS','OTHER_QC'] as const;

type Niche = typeof NICHES[number];
type Region = typeof REGIONS[number];

class CreateCompanyDto {
  @IsString() name!: string;
  @IsString() niche!: Niche;
  @IsString() @IsOptional() region?: Region;
  @IsString() @IsOptional() city?: string;
  @IsString() @IsOptional() address?: string;
  @IsString() @IsOptional() website?: string;
  @IsString() @IsOptional() phone?: string;
  @IsString() @IsOptional() email?: string;
  @IsString() @IsOptional() description?: string;
  @IsString() @IsOptional() notes?: string;
}

@ApiTags('companies')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), WorkspaceMemberGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companies: CompaniesService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une entreprise' })
  create(@WorkspaceId() workspaceId: string, @Body() dto: CreateCompanyDto) {
    return this.companies.create(workspaceId, dto as Parameters<CompaniesService['create']>[1]);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les entreprises' })
  @ApiQuery({ name: 'niche', required: false })
  @ApiQuery({ name: 'region', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @WorkspaceId() workspaceId: string,
    @Query('niche') niche?: Niche,
    @Query('region') region?: Region,
    @Query('search') search?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.companies.findAll(workspaceId, { niche, region, search, page: Number(page), limit: Number(limit) });
  }

  @Get(':id') findOne(@WorkspaceId() workspaceId: string, @Param('id') id: string) {
    return this.companies.findById(workspaceId, id);
  }

  @Patch(':id') update(@WorkspaceId() workspaceId: string, @Param('id') id: string, @Body() dto: Partial<CreateCompanyDto>) {
    return this.companies.update(workspaceId, id, dto as Parameters<CompaniesService['update']>[2]);
  }

  @Delete(':id') remove(@WorkspaceId() workspaceId: string, @Param('id') id: string) {
    return this.companies.delete(workspaceId, id);
  }
}
