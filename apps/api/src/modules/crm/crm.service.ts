import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { LeadStatus, PipelineStage } from '@cc-outreach/database/src/generated';

@Injectable()
export class CrmService {
  private readonly logger = new Logger(CrmService.name);

  constructor(private readonly prisma: PrismaService) {}

  async updateLeadStatus(leadId: string, status: LeadStatus, stage?: PipelineStage) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return this.prisma.lead.update({
      where: { id: leadId },
      data: {
        status,
        pipelineStage: stage ?? lead.pipelineStage,
      },
    });
  }

  async addNote(leadId: string, userId: string, note: string) {
    return this.prisma.activity.create({
      data: {
        leadId,
        userId,
        eventType: 'NOTE_ADDED',
        metadata: { note },
      },
    });
  }

  async setReminder(leadId: string, userId: string, dueAt: Date, note: string) {
    return this.prisma.reminder.create({
      data: {
        leadId,
        userId,
        dueAt,
        note,
      },
    });
  }

  async listReminders(userId: string) {
    return this.prisma.reminder.findMany({
      where: { userId, done: false },
      include: { lead: { include: { company: true } } },
      orderBy: { dueAt: 'asc' },
    });
  }

  async completeReminder(reminderId: string) {
    return this.prisma.reminder.update({
      where: { id: reminderId },
      data: {
        done: true,
        doneAt: new Date(),
      },
    });
  }
}
