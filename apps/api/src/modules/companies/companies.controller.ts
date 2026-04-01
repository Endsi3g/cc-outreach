import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { IsString, IsOptional } from 'class-validator';
import { CompaniesService } from './companies.service';

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
@UseGuards(AuthGuard('jwt'))
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companies: CompaniesService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une entreprise' })
  create(@Body() dto: CreateCompanyDto) { return this.companies.create(dto as Parameters<CompaniesService['create']>[0]); }

  @Get()
  @ApiOperation({ summary: 'Lister les entreprises' })
  @ApiQuery({ name: 'niche', required: false })
  @ApiQuery({ name: 'region', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('niche') niche?: Niche,
    @Query('region') region?: Region,
    @Query('search') search?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.companies.findAll({ niche, region, search, page: Number(page), limit: Number(limit) });
  }

  @Get(':id') findOne(@Param('id') id: string) { return this.companies.findById(id); }

  @Patch(':id') update(@Param('id') id: string, @Body() dto: Partial<CreateCompanyDto>) {
    return this.companies.update(id, dto as Parameters<CompaniesService['update']>[1]);
  }

  @Delete(':id') remove(@Param('id') id: string) { return this.companies.delete(id); }
}
