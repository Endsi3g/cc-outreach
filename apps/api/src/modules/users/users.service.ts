import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

interface CreateUserInput {
  email: string;
  passwordHash?: string;
  name?: string;
  googleId?: string;
  avatarUrl?: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserInput) {
    return this.prisma.user.create({ data });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByGoogleId(googleId: string) {
    return this.prisma.user.findUnique({ where: { googleId } });
  }

  async update(id: string, data: Partial<CreateUserInput> & {
    gmailAccessToken?: string;
    gmailRefreshToken?: string;
    gmailTokenExpiry?: Date;
    gmailEmail?: string;
    locale?: string;
    notifyTelegram?: boolean;
    notifyDiscord?: boolean;
  }) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async updateGmailTokens(id: string, tokens: {
    gmailAccessToken: string;
    gmailRefreshToken?: string;
    gmailTokenExpiry?: Date;
    gmailEmail?: string;
  }) {
    return this.prisma.user.update({ where: { id }, data: tokens });
  }
}
