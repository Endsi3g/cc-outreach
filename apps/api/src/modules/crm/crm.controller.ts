import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { CrmService } from './crm.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LeadStatus, PipelineStage } from '@cc-outreach/database/src/generated';

@Controller('crm')
@UseGuards(JwtAuthGuard)
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Patch('leads/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: LeadStatus,
    @Body('stage') stage?: PipelineStage,
  ) {
    return this.crmService.updateLeadStatus(id, status, stage);
  }

  @Post('leads/:id/notes')
  async addNote(
    @Param('id') id: string,
    @Body('note') note: string,
    @Request() req: any,
  ) {
    return this.crmService.addNote(id, req.user.id, note);
  }

  @Post('leads/:id/reminders')
  async setReminder(
    @Param('id') id: string,
    @Body('dueAt') dueAt: string,
    @Body('note') note: string,
    @Request() req: any,
  ) {
    return this.crmService.setReminder(id, req.user.id, new Date(dueAt), note);
  }

  @Get('reminders')
  async listReminders(@Request() req: any) {
    return this.crmService.listReminders(req.user.id);
  }

  @Patch('reminders/:id/complete')
  async completeReminder(@Param('id') id: string) {
    return this.crmService.completeReminder(id);
  }
}
