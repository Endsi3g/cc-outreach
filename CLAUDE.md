# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CC-Outreach is a B2B local prospecting platform powered by AI for Quebec businesses. It's a monorepo using pnpm workspaces with Turbo, NestJS, Prisma, and Next.js.

## Commands

```bash
# Install dependencies
pnpm install

# Start all services in development
pnpm dev

# Start individual services
pnpm dev:api      # NestJS API on port 3000
pnpm dev:worker   # BullMQ worker on port 3001
pnpm dev:scheduler # Scheduler on port 3002
cd apps/dashboard && pnpm dev  # Next.js dashboard on port 3003

# Database
pnpm db:generate  # Generate Prisma client
pnpm db:push     # Push schema to database
pnpm db:migrate  # Run migrations
pnpm db:seed     # Seed database
pnpm db:studio   # Open Prisma Studio

# Build & test
pnpm build        # Build all packages/apps
pnpm lint         # Lint all packages/apps
pnpm test         # Run tests
pnpm clean        # Clean build artifacts
```

## Architecture

### Apps (Services)

- **apps/api** (port 3000): NestJS REST API with auth (JWT, Google OAuth), business logic, modules for leads, companies, contacts, campaigns, gmail, crm, ai, enrichment, scoring, outreach, analytics
- **apps/worker** (port 3001): BullMQ workers for async enrichment, web audits, AI generation
- **apps/scheduler** (port 3002): Scheduled task manager
- **apps/dashboard** (port 3003): Next.js 14 frontend with glassmorphism UI

### Shared Packages

- **packages/database**: Prisma schema (`prisma/schema.prisma`) and generated client - defines LeadStatus, PipelineStage, CompanyNiche, CompanyRegion enums and all models
- **packages/integrations**: Clients for Google API, Apify, Gmail, Telegram, Discord, Ollama
- **packages/prompt-library**: Centralized AI prompts
- **packages/shared-dtos**: Shared DTOs
- **packages/shared-types**: Shared TypeScript types
- **packages/shared-utils**: Utilities (dates, hash, scores, strings, URLs)

### Database

- PostgreSQL 16+ with Prisma ORM
- Redis 7+ for BullMQ queues
- Schema located at `prisma/schema.prisma`

### Key Enums

- LeadStatus: NEW → ENRICHING → ENRICHED → SCORING → SCORED → OUTREACH_DRAFT → OUTREACH_READY → SENT → REPLIED → QUALIFIED → DISQUALIFIED → LOST/WON
- PipelineStage: COLD → CONTACTED → ENGAGED → MEETING → PROPOSAL → CLOSED_WON/CLOSED_LOST
- CompanyNiche: CONSTRUCTION, TOITURE, EXCAVATION, HVAC, ELECTRICITE, PLOMBERIE, etc.
- CompanyRegion: MONTREAL, LAVAL, RIVE_SUD, RIVE_NORD, QUEBEC_CITY, etc.

### API Modules

Auth, Leads, Companies, Contacts, Sources, Enrichment, AI, Gmail, Campaigns, CRM, Activities, Reminders, Notifications, Analytics, Tags, Search, Files, Jobs, Compliance, Observability, Users, Workspace, Website-Audit, Scoring, Outreach, Health

## Environment

Required variables in `.env`:

- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`: Redis for BullMQ
- `JWT_SECRET`: Auth secret (min 32 chars)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: Google OAuth
- `OLLAMA_BASE_URL`, `OLLAMA_DEFAULT_MODEL`: Local AI (optional)

## Docker Development

```bash
cd infra
docker-compose up -d  # Starts PostgreSQL + Redis
```