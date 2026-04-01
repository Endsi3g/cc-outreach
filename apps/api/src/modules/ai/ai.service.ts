import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import type { AiProvider, AiRunMeta } from '@cc-outreach/shared-types';
import { hashJson } from '@cc-outreach/shared-utils';

interface OllamaGenerateOptions {
  model?: string;
  prompt: string;
  temperature?: number;
  promptVersion?: string;
  outputSchemaVersion?: string;
}

interface AiResult<T = unknown> {
  data: T;
  meta: AiRunMeta;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private readonly config: ConfigService) {}

  /**
   * Generate a JSON-structured response via Ollama.
   * Retries once on JSON parse failure.
   */
  async generateJson<T = unknown>(options: OllamaGenerateOptions): Promise<AiResult<T>> {
    const baseUrl = this.config.get<string>('OLLAMA_BASE_URL', 'http://localhost:11434');
    const model = options.model ?? this.config.get<string>('OLLAMA_DEFAULT_MODEL', 'llama3.1');
    const temperature = options.temperature ?? 0.3;
    const start = Date.now();

    const fullPrompt = `${options.prompt}\n\nRéponds uniquement avec un objet JSON valide, sans markdown, sans commentaires.`;

    try {
      const response = await axios.post(
        `${baseUrl}/api/generate`,
        { model, prompt: fullPrompt, stream: false, options: { temperature } },
        { timeout: Number(this.config.get('OLLAMA_TIMEOUT_MS', 60000)) },
      );

      const raw: string = response.data?.response ?? '';
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Aucun JSON trouvé dans la réponse Ollama');

      const data: T = JSON.parse(jsonMatch[0]);
      const meta: AiRunMeta = {
        promptVersion: options.promptVersion ?? '0.1.0',
        provider: 'OLLAMA' as AiProvider,
        model,
        temperature,
        inputHash: hashJson(options.prompt),
        outputSchemaVersion: options.outputSchemaVersion ?? '0.1.0',
        durationMs: Date.now() - start,
      };

      this.logger.debug(`Ollama [${model}] — ${meta.durationMs}ms`);
      return { data, meta };
    } catch (err) {
      this.logger.error('Erreur Ollama:', (err as Error).message);
      throw err;
    }
  }
}
