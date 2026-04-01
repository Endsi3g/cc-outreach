import { Controller, Get, Post, Query, UseGuards, Request, Param } from '@nestjs/common';
import { GmailService } from './gmail.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('gmail')
@UseGuards(JwtAuthGuard)
export class GmailController {
  constructor(private readonly gmailService: GmailService) {}

  @Get('auth-url')
  getAuthUrl() {
    return { url: this.gmailService.getAuthUrl() };
  }

  @Get('callback')
  async handleCallback(@Query('code') code: string, @Request() req: any) {
    return this.gmailService.handleCallback(code, req.user.id);
  }

  @Post('send/:draftId')
  async sendOutreach(@Param('draftId') draftId: string, @Request() req: any) {
    return this.gmailService.sendOutreach(req.user.id, draftId);
  }

  @Get('threads/:leadId')
  async getThreads(@Param('leadId') leadId: string) {
    return this.gmailService.getThreads(leadId);
  }
}
