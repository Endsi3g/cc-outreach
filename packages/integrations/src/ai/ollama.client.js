"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaClient = void 0;
const axios_1 = __importDefault(require("axios"));
const shared_utils_1 = require("@cc-outreach/shared-utils");
class OllamaClient {
    defaultBaseUrl;
    defaultModel;
    constructor(defaultBaseUrl = 'http://localhost:11434', defaultModel = 'llama3.1') {
        this.defaultBaseUrl = defaultBaseUrl;
        this.defaultModel = defaultModel;
    }
    async generateJson(options) {
        const baseUrl = options.baseUrl ?? this.defaultBaseUrl;
        const model = options.model ?? this.defaultModel;
        const temperature = options.temperature ?? 0.3;
        const start = Date.now();
        const fullPrompt = `${options.prompt}\n\nRéponds uniquement avec un objet JSON valide, sans markdown, sans commentaires.`;
        try {
            const response = await axios_1.default.post(`${baseUrl}/api/generate`, { model, prompt: fullPrompt, stream: false, options: { temperature } }, { timeout: 90000 });
            const raw = response.data?.response ?? '';
            const jsonMatch = raw.match(/\{[\s\S]*\}/);
            if (!jsonMatch)
                throw new Error('Aucun JSON trouvé dans la réponse Ollama');
            const data = JSON.parse(jsonMatch[0]);
            const meta = {
                promptVersion: options.promptVersion ?? '1.0.0',
                provider: 'OLLAMA',
                model,
                temperature,
                inputHash: (0, shared_utils_1.hashJson)(options.prompt),
                outputSchemaVersion: options.outputSchemaVersion ?? '1.0.0',
                durationMs: Date.now() - start,
            };
            return { data, meta };
        }
        catch (err) {
            throw new Error(`Ollama failed: ${err.message}`);
        }
    }
}
exports.OllamaClient = OllamaClient;
//# sourceMappingURL=ollama.client.js.map