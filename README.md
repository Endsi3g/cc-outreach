# CC-Outreach (Uprise Sales OS) v1.0.0 🚀

> Plateforme de prospection B2B locale propulsée par IA pour le Québec.

CC-Outreach est un écosystème complet conçu pour les agences de services ciblant les entreprises locales au Québec (construction, toiture, excavation, CVC, électricité, plomberie, etc.). Le système automatise le pipeline complet, de la détection de leads sur Google Maps à l'envoi d'emails ultra-personnalisés.

## 🛠️ Fonctionnalités Clefs

- **Acquisition & Normalisation** : Import depuis Google Maps, déduplication intelligente et gestion des entreprises/contacts.
- **Enrichissement de Données** : Collecte automatique d'informations publiques, réseaux sociaux et signaux métiers.
- **Audit Web Automatisé** : Mini-crawler analysant le site web du prospect (SEO, UX, contenu, structure).
- **Scoring IA Multi-critères** : Évaluation du "fit", de l'urgence, et des opportunités digitales.
- **Génération d'Outreach Personnalisé** : Création d'angles d'approche spécifiques et de drafts d'emails bilingues (FR/EN) via IA.
- **Intégration Gmail & CRM** : Suivi des conversations, rappels et gestion du pipeline commercial.
- **Dashboard Premium** : Interface glassmorphism moderne pour piloter tout le système.
- **Analytics & Observabilité** : Métriques détaillées, logs structurés et monitoring.

## 🏗️ Architecture (Monorepo)

Le projet utilise une architecture modulaire avec **Turbo**, **NestJS**, **Prisma**, **Next.js** et **pnpm-workspaces**.

### Services

| Service | Port | Description |
|---------|------|-------------|
| `apps/api` | 3000 | Backend principal NestJS (API REST, Auth, Business logic) |
| `apps/worker` | 3001 | Workers asynchrones pour l'enrichissement, l'audit et l'IA (BullMQ) |
| `apps/scheduler` | 3002 | Gestionnaire de tâches planifiées |
| `apps/dashboard` | 3003 | Interface utilisateur Next.js 14 (App Router) |

### Packages Partagés

- `packages/database` : Couche de données partagée avec Prisma ORM
- `packages/integrations` : Clients pour Google API, Apify, Gmail, Telegram/Discord, Ollama
- `packages/prompt-library` : Bibliothèque de prompts centralisée pour l'IA
- `packages/shared-dtos` : Data Transfer Objects partagés
- `packages/shared-types` : Types TypeScript partagés
- `packages/shared-utils` : Utilitaires communs (dates, hash, scores, strings, URLs)

## 🚀 Démarrage Rapide

### Prérequis

- [Node.js](https://nodejs.org/) (>= 20.0.0)
- [pnpm](https://pnpm.io/) (>= 9.0.0)
- [PostgreSQL](https://www.postgresql.org/) (16+)
- [Redis](https://redis.io/) (7+) - pour BullMQ
- [Docker](https://www.docker.com/) & Docker Compose (optionnel mais recommandé)
- [Ollama](https://ollama.com/) (optionnel - pour l'IA locale)

### Option 1 : Docker Compose (Recommandé)

1. **Cloner le repo** :
   ```bash
   git clone https://github.com/Endsi3g/cc-outreach.git
   cd cc-outreach
   ```

2. **Configurer l'environnement** :
   ```bash
   cp .env.example .env
   # Éditer .env avec vos identifiants
   ```

3. **Lancer avec Docker Compose** :
   ```bash
   cd infra
   docker-compose -f docker-compose.prod.yml up -d
   ```

4. **Accéder aux services** :
   - API : http://localhost:3000
   - Dashboard : http://localhost:3003
   - Worker : http://localhost:3001
   - Scheduler : http://localhost:3002

### Option 2 : Développement Local

1. **Cloner et installer** :
   ```bash
   git clone https://github.com/Endsi3g/cc-outreach.git
   cd cc-outreach
   pnpm install
   ```

2. **Démarrer l'infrastructure** :
   ```bash
   cd infra
   docker-compose up -d
   cd ..
   ```

3. **Configurer la base de données** :
   ```bash
   pnpm db:generate
   pnpm db:push
   # Optionnel: pnpm db:seed
   ```

4. **Lancer en mode développement** :
   ```bash
   # Option A - Tout en une commande
   pnpm dev

   # Option B - Services individuels
   pnpm dev:api      # API uniquement
   pnpm dev:worker   # Worker uniquement
   pnpm dev:scheduler # Scheduler uniquement
   ```

   Le Dashboard se lance séparément :
   ```bash
   cd apps/dashboard
   pnpm dev
   ```

### Option 3 : PowerShell (Windows)

```powershell
.\dev.ps1
```

## 🐳 Déploiement Production

### Railway (Recommandé pour PaaS)

1. Connectez votre repo GitHub à Railway
2. Configurez les variables d'environnement dans Railway Dashboard
3. Déployez - Railway détectera automatiquement les services

```bash
# Configurer Railway CLI (optionnel)
npm install -g @railway/cli
railway login
railway link
railway up
```

### VPS avec Docker Compose

```bash
# Sur votre serveur
git clone https://github.com/Endsi3g/cc-outreach.git
cd cc-outreach

# Copier et configurer .env
cp .env.example .env
nano .env  # Éditer vos variables

# Build et démarrage
cd infra
docker-compose -f docker-compose.prod.yml up -d --build

# Logs
docker-compose -f docker-compose.prod.yml logs -f api
docker-compose -f docker-compose.prod.yml logs -f worker
```

### Render

1. Créez un nouveau Web Service
2. Connectez votre repo GitHub
3. Utilisez le Dockerfile dans `apps/api/Dockerfile`
4. Configurez les variables d'environnement
5. Déployez

## 📋 Variables d'Environnement

### Obligatoires

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# Application
NODE_ENV=production
PORT=3000
JWT_SECRET=your_super_secret_jwt_key_minimum_32_chars
JWT_EXPIRES_IN=7d
```

### Intégrations (Recommandées)

```env
# Google OAuth / Gmail
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your-domain.com/auth/google/callback
GMAIL_SCOPES=https://mail.google.com/

# Ollama (IA locale)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_DEFAULT_MODEL=llama3.1
OLLAMA_TIMEOUT_MS=60000

# Notifications
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

### Rate Limiting

```env
GMAIL_DAILY_QUOTA=450
CRAWL_DELAY_MS=1500
GOOGLE_MAPS_DELAY_MS=2000
```

Voir `.env.example` pour la liste complète.

## 🧪 Tests & Qualité

```bash
# Linting
pnpm lint

# Build complet
pnpm build

# Tests
pnpm test

# Nettoyage
pnpm clean
```

## 📁 Structure du Projet

```
cc-outreach/
├── apps/
│   ├── api/              # Backend API NestJS
│   ├── worker/           # Background workers
│   ├── scheduler/        # Scheduled tasks
│   └── dashboard/        # Next.js frontend
├── packages/
│   ├── config/           # Shared configurations
│   ├── database/         # Prisma schema & client
│   ├── integrations/     # External API clients
│   ├── prompt-library/   # AI prompts
│   ├── shared-dtos/      # Shared DTOs
│   ├── shared-types/     # Shared types
│   └── shared-utils/     # Shared utilities
├── infra/                # Infrastructure (Docker Compose)
├── docs/                 # Documentation
├── .github/              # GitHub Actions
└── package.json          # Root workspace config
```

## 🔄 CI/CD

Le projet utilise GitHub Actions pour :

- **CI** (`.github/workflows/ci.yml`) : Tests et build sur chaque push/PR
- **Release** (`.github/workflows/release.yml`) : Création automatique de release sur tag

Pour créer une release :

```bash
git tag -a v1.0.1 -m "Release v1.0.1"
git push origin v1.0.1
```

La release sera automatiquement créée avec les notes de version.

## 🛡️ Sécurité

- Les tokens OAuth sont chiffrés en base de données (AES-256)
- Rate limiting configuré pour prévenir les abus
- Validation stricte des entrées utilisateur
- Variables sensibles jamais commitées (utilisez `.env`)

## 🤝 Contribution

1. Fork le projet
2. Créez une branche (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📞 Support

Pour toute question ou problème :
- Ouvrez une issue sur GitHub
- Contactez l'équipe via Telegram/Discord (si configuré)

## 📜 Licence

Privé - Tous droits réservés.
Copyright © 2026 CC-Outreach / Uprise Sales OS.

---

**Version** : 1.0.0  
**Build** : Production Ready  
**Dernière mise à jour** : Avril 2026