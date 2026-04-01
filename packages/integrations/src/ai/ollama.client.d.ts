import type { AiRunMeta } from '@cc-outreach/shared-types';
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
export declare class OllamaClient {
    private readonly defaultBaseUrl;
    private readonly defaultModel;
    constructor(defaultBaseUrl?: string, defaultModel?: string);
    generateJson<T = unknown>(options: OllamaGenerateOptions): Promise<AiResult<T>>;
}
//# sourceMappingURL=ollama.client.d.ts.map