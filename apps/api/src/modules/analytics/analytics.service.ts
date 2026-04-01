import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getGlobalStats() {
    const [totalLeads, totalDrafts, totalSent, totalReplies] = await Promise.all([
      this.prisma.lead.count(),
      this.prisma.outreachDraft.count(),
      this.prisma.outreachDraft.count({ where: { status: 'SENT' } }),
      this.prisma.gmailThread.count({ where: { hasReply: true } }),
    ]);

    const replyRate = totalSent > 0 ? (totalReplies / totalSent) * 100 : 0;

    return {
      totalLeads,
      totalDrafts,
      totalSent,
      totalReplies,
      replyRate: Number(replyRate.toFixed(2)),
    };
  }

  async getPipelineStats() {
    const stats = await this.prisma.lead.groupBy({
      by: ['pipelineStage'],
      _count: {
        _all: true,
      },
    });

    return stats.map((s) => ({
      stage: s.pipelineStage,
      count: s._count._all,
    }));
  }

  async getNicheStats() {
    const stats = await this.prisma.company.groupBy({
      by: ['niche'],
      _count: {
        _all: true,
      },
    });

    return stats.map((s) => ({
      niche: s.niche,
      count: s._count._all,
    }));
  }

  async getDailyActivities(days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const activities = await this.prisma.activity.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        eventType: true,
        createdAt: true,
      },
    });

    // Simple aggregation by day (logic can be expanded)
    return activities;
  }
}
