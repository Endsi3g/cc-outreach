import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // ── App ────────────────────────────────────────────────────────────────
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  API_URL: Joi.string().uri().default('http://localhost:3000'),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),

  // ── Database ──────────────────────────────────────────────────────────
  DATABASE_URL: Joi.string().required(),

  // ── Redis ─────────────────────────────────────────────────────────────
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().allow('').optional(),

  // ── Google / Gmail OAuth ──────────────────────────────────────────────
  GOOGLE_CLIENT_ID: Joi.string().allow('').optional(),
  GOOGLE_CLIENT_SECRET: Joi.string().allow('').optional(),
  GOOGLE_REDIRECT_URI: Joi.string().uri().default('http://localhost:3000/api/v1/auth/google/callback'),
  GMAIL_SCOPES: Joi.string().default('https://mail.google.com/'),

  // ── Ollama ────────────────────────────────────────────────────────────
  OLLAMA_BASE_URL: Joi.string().uri().default('http://localhost:11434'),
  OLLAMA_DEFAULT_MODEL: Joi.string().default('llama3.1'),
  OLLAMA_TIMEOUT_MS: Joi.number().default(60000),

  // ── Notifications ─────────────────────────────────────────────────────
  TELEGRAM_BOT_TOKEN: Joi.string().allow('').optional(),
  TELEGRAM_CHAT_ID: Joi.string().allow('').optional(),
  DISCORD_WEBHOOK_URL: Joi.string().uri().allow('').optional(),

  // ── Workers ───────────────────────────────────────────────────────────
  WORKER_CONCURRENCY: Joi.number().default(3),
  WORKER_PORT: Joi.number().default(3001),
  SCHEDULER_PORT: Joi.number().default(3002),

  // ── Rate limiting ─────────────────────────────────────────────────────
  GMAIL_DAILY_QUOTA: Joi.number().default(450),
  CRAWL_DELAY_MS: Joi.number().default(1500),
  GOOGLE_MAPS_DELAY_MS: Joi.number().default(2000),
}).options({ allowUnknown: true });
