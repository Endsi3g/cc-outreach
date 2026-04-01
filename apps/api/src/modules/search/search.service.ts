import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private readonly prisma: PrismaService) {}

  async globalSearch(query: string) {
    const [companies, contacts, leads] = await Promise.all([
      this.prisma.company.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { website: { contains: query, mode: 'insensitive' } },
            { domain: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 10,
      }),
      this.prisma.contact.findMany({
        where: {
          OR: [
            { fullName: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: { company: true },
        take: 10,
      }),
      this.prisma.lead.findMany({
        where: {
          OR: [
            { notes: { contains: query, mode: 'insensitive' } },
            { company: { name: { contains: query, mode: 'insensitive' } } },
          ],
        },
        include: { company: true },
        take: 10,
      }),
    ]);

    return {
      companies,
      contacts,
      leads,
    };
  }
}
