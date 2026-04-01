import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma, ActivityEventType } from '@cc-outreach/database/src/generated';

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async log(leadId: string, eventType: ActivityEventType, userId?: string, metadata?: Record<string, unknown>) {
    return this.prisma.activity.create({
      data: { 
        leadId, 
        eventType, 
        userId, 
        metadata: (metadata as Prisma.InputJsonValue) ?? Prisma.JsonNull 
      },
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
