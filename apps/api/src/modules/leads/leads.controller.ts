import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LeadsService } from './leads.service';
import { LeadStatus, PipelineStage } from '@cc-outreach/database/src/generated';
import { WorkspaceMemberGuard } from '../auth/guards/workspace-member.guard';
import { WorkspaceId } from '../auth/decorators/workspace-id.decorator';

class CreateLeadDto {
  @IsString() companyId!: string;
  @IsString() @IsOptional() ownerId?: string;
}

class ChangeStatusDto { @IsEnum(LeadStatus) status!: LeadStatus; }
class ChangeStageDto { @IsEnum(PipelineStage) stage!: PipelineStage; }
class MarkLostDto { @IsString() @IsOptional() reason?: string; }

@ApiTags('leads')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), WorkspaceMemberGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly leads: LeadsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un lead' })
  create(@WorkspaceId() workspaceId: string, @Body() dto: CreateLeadDto) {
    return this.leads.create(workspaceId, dto.companyId, dto.ownerId);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les leads' })
  @ApiQuery({ name: 'status', required: false, enum: LeadStatus })
  @ApiQuery({ name: 'stage', required: false, enum: PipelineStage })
  @ApiQuery({ name: 'ownerId', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @WorkspaceId() workspaceId: string,
    @Query('status') status?: LeadStatus,
    @Query('stage') stage?: PipelineStage,
    @Query('ownerId') ownerId?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.leads.findAll(workspaceId, { status, stage, ownerId, page: Number(page), limit: Number(limit) });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail lead complet' })
  findOne(@WorkspaceId() workspaceId: string, @Param('id') id: string) { return this.leads.findById(workspaceId, id); }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Changer le statut' })
  changeStatus(@WorkspaceId() workspaceId: string, @Param('id') id: string, @Body() dto: ChangeStatusDto) {
    return this.leads.changeStatus(workspaceId, id, dto.status);
  }

  @Patch(':id/stage')
  @ApiOperation({ summary: 'Changer le stage pipeline' })
  changeStage(@WorkspaceId() workspaceId: string, @Param('id') id: string, @Body() dto: ChangeStageDto) {
    return this.leads.changeStage(workspaceId, id, dto.stage);
  }

  @Patch(':id/owner')
  @ApiOperation({ summary: 'Assigner un owner' })
  assignOwner(@WorkspaceId() workspaceId: string, @Param('id') id: string, @Body('ownerId') ownerId: string) {
    return this.leads.assignOwner(workspaceId, id, ownerId);
  }

  @Patch(':id/qualify')
  @ApiOperation({ summary: 'Qualifier le lead' })
  qualify(@WorkspaceId() workspaceId: string, @Param('id') id: string) { return this.leads.markQualified(workspaceId, id); }

  @Patch(':id/lost')
  @ApiOperation({ summary: 'Marquer comme perdu' })
  lost(@WorkspaceId() workspaceId: string, @Param('id') id: string, @Body() dto: MarkLostDto) { return this.leads.markLost(workspaceId, id, dto.reason); }

  @Patch(':id/won')
  @ApiOperation({ summary: 'Marquer comme gagné' })
  won(@WorkspaceId() workspaceId: string, @Param('id') id: string) { return this.leads.markWon(workspaceId, id); }
}
