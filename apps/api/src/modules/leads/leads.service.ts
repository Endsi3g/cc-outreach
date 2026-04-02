import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { LeadStatus, PipelineStage } from '@cc-outreach/shared-types';

interface FilterOptions {
  status?: LeadStatus;
  stage?: PipelineStage;
  ownerId?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(workspaceId: string, companyId: string, ownerId?: string) {
    return this.prisma.lead.create({
      data: { workspaceId, companyId, ownerId, status: 'NEW', pipelineStage: 'COLD' },
      include: { company: true },
    });
  }

  async findAll(workspaceId: string, filters: FilterOptions = {}) {
    const { status, stage, ownerId, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;
    const where: Record<string, any> = { workspaceId };
    if (status) where['status'] = status;
    if (stage) where['pipelineStage'] = stage;
    if (ownerId) where['ownerId'] = ownerId;

    const [leads, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          company: { include: { score: true } },
          owner: { select: { id: true, name: true, email: true } },
          _count: { select: { outreachDrafts: true, activities: true } },
        },
      }),
      this.prisma.lead.count({ where }),
    ]);

    return { leads, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findById(workspaceId: string, id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id, workspaceId },
      include: {
        company: { include: { contacts: true, websiteAudit: true, score: true, sources: true } },
        owner: { select: { id: true, name: true, email: true } },
        outreachDrafts: { orderBy: { createdAt: 'desc' } },
        activities: { orderBy: { createdAt: 'desc' }, take: 20 },
        reminders: { where: { done: false }, orderBy: { dueAt: 'asc' } },
        gmailThreads: { orderBy: { lastMessageAt: 'desc' } },
      },
    });
    if (!lead) throw new NotFoundException(`Lead ${id} introuvable`);
    return lead;
  }

  async changeStatus(workspaceId: string, id: string, status: LeadStatus) {
    return this.prisma.lead.update({ where: { id, workspaceId }, data: { status } });
  }

  async changeStage(workspaceId: string, id: string, stage: PipelineStage) {
    return this.prisma.lead.update({ where: { id, workspaceId }, data: { pipelineStage: stage } });
  }

  async assignOwner(workspaceId: string, id: string, ownerId: string) {
    return this.prisma.lead.update({ where: { id, workspaceId }, data: { ownerId } });
  }

  async markQualified(workspaceId: string, id: string) {
    return this.prisma.lead.update({ where: { id, workspaceId }, data: { status: 'QUALIFIED', qualifiedAt: new Date() } });
  }

  async markLost(workspaceId: string, id: string, reason?: string) {
    return this.prisma.lead.update({ where: { id, workspaceId }, data: { status: 'LOST', lostAt: new Date(), lostReason: reason } });
  }

  async markWon(workspaceId: string, id: string) {
    return this.prisma.lead.update({ where: { id, workspaceId }, data: { status: 'WON', wonAt: new Date() } });
  }
}
