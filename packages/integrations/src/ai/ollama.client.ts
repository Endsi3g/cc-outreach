import axios from 'axios';
import { hashJson } from '@cc-outreach/shared-utils';
import type { AiProvider, AiRunMeta } from '@cc-outreach/shared-types';

export interface OllamaGenerateOptions {
  model?: string;
  prompt: string;
  temperature?: number;
  promptVersion?: string;
  outputSchemaVersion?: string;
  baseUrl?: string;
}

export interface AiResult<T = unknown> {
  data: T;
  meta: AiRunMeta;
}

export class OllamaClient {
  constructor(private readonly defaultBaseUrl = 'http://localhost:11434', private readonly defaultModel = 'llama3.1') {}

  async generateJson<T = unknown>(options: OllamaGenerateOptions): Promise<AiResult<T>> {
    const baseUrl = options.baseUrl ?? this.defaultBaseUrl;
    const model = options.model ?? this.defaultModel;
    const temperature = options.temperature ?? 0.3;
    const start = Date.now();

    const fullPrompt = `${options.prompt}\n\nRéponds uniquement avec un objet JSON valide, sans markdown, sans commentaires.`;

    try {
      const response = await axios.post(
        `${baseUrl}/api/generate`,
        { model, prompt: fullPrompt, stream: false, options: { temperature } },
        { timeout: 90000 },
      );

      const raw: string = response.data?.response ?? '';
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Aucun JSON trouvé dans la réponse Ollama');

      const data: T = JSON.parse(jsonMatch[0]);
      const meta: AiRunMeta = {
        promptVersion: options.promptVersion ?? '1.0.0',
        provider: 'OLLAMA' as AiProvider,
        model,
        temperature,
        inputHash: hashJson(options.prompt),
        outputSchemaVersion: options.outputSchemaVersion ?? '1.0.0',
        durationMs: Date.now() - start,
      };

      return { data, meta };
    } catch (err: any) {
      throw new Error(`Ollama failed: ${err.message}`);
    }
  }
}
