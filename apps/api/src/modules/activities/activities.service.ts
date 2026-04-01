import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ActivityEventType } from '@cc-outreach/shared-types';

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async log(leadId: string, eventType: ActivityEventType, userId?: string, metadata?: Record<string, unknown>) {
    return this.prisma.activity.create({
      data: { leadId, eventType, userId, metadata: metadata ?? undefined },
    });
  }

  async findByLead(leadId: string, limit = 50) {
    return this.prisma.activity.findMany({
      where: { leadId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { user: { select: { id: true, name: true } } },
    });
  }
}
