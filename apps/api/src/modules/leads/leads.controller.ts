import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LeadsService } from './leads.service';
import { LeadStatus, PipelineStage } from '@cc-outreach/database/src/generated';

class CreateLeadDto {
  @IsString() companyId!: string;
  @IsString() @IsOptional() ownerId?: string;
}

class ChangeStatusDto { @IsEnum(LeadStatus) status!: LeadStatus; }
class ChangeStageDto { @IsEnum(PipelineStage) stage!: PipelineStage; }
class MarkLostDto { @IsString() @IsOptional() reason?: string; }

@ApiTags('leads')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('leads')
export class LeadsController {
  constructor(private readonly leads: LeadsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un lead' })
  create(@Body() dto: CreateLeadDto) {
    return this.leads.create(dto.companyId, dto.ownerId);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les leads' })
  @ApiQuery({ name: 'status', required: false, enum: LeadStatus })
  @ApiQuery({ name: 'stage', required: false, enum: PipelineStage })
  @ApiQuery({ name: 'ownerId', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('status') status?: LeadStatus,
    @Query('stage') stage?: PipelineStage,
    @Query('ownerId') ownerId?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.leads.findAll({ status, stage, ownerId, page: Number(page), limit: Number(limit) });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail lead complet' })
  findOne(@Param('id') id: string) { return this.leads.findById(id); }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Changer le statut' })
  changeStatus(@Param('id') id: string, @Body() dto: ChangeStatusDto) {
    return this.leads.changeStatus(id, dto.status);
  }

  @Patch(':id/stage')
  @ApiOperation({ summary: 'Changer le stage pipeline' })
  changeStage(@Param('id') id: string, @Body() dto: ChangeStageDto) {
    return this.leads.changeStage(id, dto.stage);
  }

  @Patch(':id/owner')
  @ApiOperation({ summary: 'Assigner un owner' })
  assignOwner(@Param('id') id: string, @Body('ownerId') ownerId: string) {
    return this.leads.assignOwner(id, ownerId);
  }

  @Patch(':id/qualify')
  @ApiOperation({ summary: 'Qualifier le lead' })
  qualify(@Param('id') id: string) { return this.leads.markQualified(id); }

  @Patch(':id/lost')
  @ApiOperation({ summary: 'Marquer comme perdu' })
  lost(@Param('id') id: string, @Body() dto: MarkLostDto) { return this.leads.markLost(id, dto.reason); }

  @Patch(':id/won')
  @ApiOperation({ summary: 'Marquer comme gagné' })
  won(@Param('id') id: string) { return this.leads.markWon(id); }
}
