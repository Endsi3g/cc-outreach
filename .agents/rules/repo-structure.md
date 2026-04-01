---
trigger: always_on
---

# Structure du repo

Le dépôt recommandé est un monorepo `pnpm`/`turbo` avec trois applications (`api`, `worker`, `scheduler`) et plusieurs packages partagés pour config, types, prompts et intégrations.

```text
prospection-ai/
├─ apps/
│  ├─ api/
│  ├─ worker/
│  └─ scheduler/
├─ packages/
│  ├─ config/
│  ├─ shared-types/
│  ├─ shared-dtos/
│  ├─ shared-utils/
│  ├─ prompt-library/
│  └─ integrations/
├─ prisma/
├─ docs/
├─ scripts/
├─ infra/
├─ project.md
└─ agent.md
```

## Détail par dossier

- `apps/api`: application NestJS principale, expose REST, auth, CRM, leads et orchestration métier.
- `apps/worker`: workers BullMQ pour ingestion, enrichissement, audit web, IA, envoi et sync Gmail.
- `apps/scheduler`: tâches planifiées et batchs réguliers.
- `packages/config`: configuration partagée (env, config Nest, etc.).
- `packages/shared-types`: types TypeScript communs.
- `packages/shared-dtos`: DTOs communs entre API et workers.
- `packages/shared-utils`: fonctions utilitaires réutilisables.
- `packages/prompt-library`: prompts et schémas de sortie pour l’agent IA.
- `packages/integrations`: clients réutilisables Google, Gmail, Telegram, Discord, crawler, registries, directories.
- `prisma/`: schéma, migrations, seed.
- `docs/`: architecture, conformité, runbooks, documentation interne.
- `scripts/`: scripts de dev, db, seed et maintenance.
- `infra/`: Docker, compose, variables d’environnement, infra locale/cloud.
