# ===========================================
# CC-Outreach Worker - Production Dockerfile
# ===========================================

FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@10.33.0

WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY turbo.json ./

# Copy all package.json files
COPY packages/config/package.json ./packages/config/
COPY packages/database/package.json ./packages/database/
COPY packages/integrations/package.json ./packages/integrations/
COPY packages/prompt-library/package.json ./packages/prompt-library/
COPY packages/shared-dtos/package.json ./packages/shared-dtos/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/shared-utils/package.json ./packages/shared-utils/
COPY apps/worker/package.json ./apps/worker/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/ ./packages/
COPY apps/worker/ ./apps/worker/

# Generate Prisma client
RUN pnpm --filter @cc-outreach/database generate

# Build the application
RUN pnpm --filter @cc-outreach/worker build

# ===========================================
# Production Stage
# ===========================================
FROM node:20-alpine AS production

# Install pnpm
RUN npm install -g pnpm@10.33.0

WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json ./

# Copy package.json files
COPY packages/config/package.json ./packages/config/
COPY packages/database/package.json ./packages/database/
COPY packages/integrations/package.json ./packages/integrations/
COPY packages/prompt-library/package.json ./packages/prompt-library/
COPY packages/shared-dtos/package.json ./packages/shared-dtos/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/shared-utils/package.json ./packages/shared-utils/
COPY apps/worker/package.json ./apps/worker/

# Copy built artifacts from builder
COPY --from=builder /app/apps/worker/dist ./apps/worker/dist
COPY --from=builder /app/packages/database/src/generated ./packages/database/src/generated
COPY --from=builder /app/packages/database/dist ./packages/database/dist
COPY --from=builder /app/packages/integrations/dist ./packages/integrations/dist
COPY --from=builder /app/packages/prompt-library/dist ./packages/prompt-library/dist
COPY --from=builder /app/packages/shared-dtos/dist ./packages/shared-dtos/dist
COPY --from=builder /app/packages/shared-types/dist ./packages/shared-types/dist
COPY --from=builder /app/packages/shared-utils/dist ./packages/shared-utils/dist
COPY --from=builder /app/packages/config ./packages/config

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

WORKDIR /app/apps/worker

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "dist/main.js"]