import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ContactRole, ContactConfidence, SourceType } from '@cc-outreach/shared-types';

interface CreateContactInput {
  companyId: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  role?: ContactRole;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  source: SourceType;
  confidence?: ContactConfidence;
  notes?: string;
}

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateContactInput) {
    return this.prisma.contact.create({ data: {
      ...data,
      role: data.role ?? 'UNKNOWN',
      confidence: data.confidence ?? 'LOW',
    }});
  }

  async findByCompany(companyId: string) {
    return this.prisma.contact.findMany({
      where: { companyId, isActive: true },
      orderBy: [{ confidence: 'desc' }, { createdAt: 'asc' }],
    });
  }

  async findById(id: string) {
    const contact = await this.prisma.contact.findUnique({ where: { id } });
    if (!contact) throw new NotFoundException(`Contact ${id} introuvable`);
    return contact;
  }

  async update(id: string, data: Partial<CreateContactInput>) {
    await this.findById(id);
    return this.prisma.contact.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.findById(id);
    return this.prisma.contact.update({ where: { id }, data: { isActive: false } });
  }
}
