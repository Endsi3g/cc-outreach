import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CompanyNiche, CompanyRegion } from '@cc-outreach/shared-types';
import { slugify, normalizeDomain } from '@cc-outreach/shared-utils';

interface CreateCompanyInput {
  name: string;
  niche: CompanyNiche;
  region?: CompanyRegion;
  city?: string;
  address?: string;
  website?: string;
  phone?: string;
  email?: string;
  googleMapsUrl?: string;
  googlePlaceId?: string;
  googleRating?: number;
  googleReviewCount?: number;
  description?: string;
}

interface FilterOptions {
  niche?: CompanyNiche;
  region?: CompanyRegion;
  page?: number;
  limit?: number;
  search?: string;
}

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(workspaceId: string, data: CreateCompanyInput) {
    const slug = slugify(data.name + '-' + (data.city ?? '') + '-' + workspaceId); // Ensure uniqueness per workspace
    const domain = data.website ? normalizeDomain(data.website) || undefined : undefined;

    return this.prisma.company.create({
      data: {
        ...data,
        workspaceId,
        slug,
        domain,
      },
    });
  }

  async findAll(workspaceId: string, filters: FilterOptions = {}) {
    const { niche, region, page = 1, limit = 20, search } = filters;
    const skip = (page - 1) * limit;

    const where: Record<string, any> = { workspaceId };
    if (niche) where['niche'] = niche;
    if (region) where['region'] = region;
    if (search) {
      where['OR'] = [
        { name: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [companies, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { lead: { select: { id: true, status: true, pipelineStage: true } }, score: true },
      }),
      this.prisma.company.count({ where }),
    ]);

    return { companies, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findById(workspaceId: string, id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id, workspaceId },
      include: { contacts: true, lead: true, websiteAudit: true, score: true, sources: true, tags: { include: { tag: true } } },
    });
    if (!company) throw new NotFoundException(`Entreprise ${id} introuvable`);
    return company;
  }

  async update(workspaceId: string, id: string, data: Partial<CreateCompanyInput> & { notes?: string }) {
    await this.findById(workspaceId, id);
    return this.prisma.company.update({ where: { id, workspaceId }, data });
  }

  async delete(workspaceId: string, id: string) {
    await this.findById(workspaceId, id);
    return this.prisma.company.delete({ where: { id, workspaceId } });
  }

  /** Vérifie les doublons par domain, phone ou nom+ville au sein d'un workspace */
  async findDuplicate(workspaceId: string, input: { domain?: string; phone?: string; name: string; city?: string }) {
    if (input.domain) {
      const byDomain = await this.prisma.company.findFirst({ where: { domain: input.domain, workspaceId } });
      if (byDomain) return byDomain;
    }
    if (input.phone) {
      const byPhone = await this.prisma.company.findFirst({ where: { phone: input.phone, workspaceId } });
      if (byPhone) return byPhone;
    }
    const slug = slugify(input.name + '-' + (input.city ?? '') + '-' + workspaceId);
    return this.prisma.company.findUnique({ where: { slug } });
  }
}
