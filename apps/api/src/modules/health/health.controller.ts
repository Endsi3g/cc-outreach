import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaHealth: PrismaHealthIndicator,
    @InjectQueue('enrichment.company') private readonly queue: Queue,
    private readonly config: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Statut de santé de tous les services' })
  async check() {
    const ollamaUrl = this.config.get<string>('OLLAMA_BASE_URL', 'http://localhost:11434');

    const results = await Promise.allSettled([
      this.queue.isReady().then(() => ({ redis: 'ok' })).catch(() => ({ redis: 'error' })),
      axios.get(`${ollamaUrl}/api/version`, { timeout: 3000 }).then(() => ({ ollama: 'ok' })).catch(() => ({ ollama: 'unavailable' })),
    ]);

    const [redisResult, ollamaResult] = results;

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        api: 'ok',
        database: 'check /health/db',
        redis: redisResult.status === 'fulfilled' ? (redisResult.value as { redis: string }).redis : 'error',
        ollama: ollamaResult.status === 'fulfilled' ? (ollamaResult.value as { ollama: string }).ollama : 'error',
        gmail: 'not_configured',
      },
    };
  }
}
