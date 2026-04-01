# CC-Outreach 🚀

> Plateforme de prospection B2B locale propulsée par IA pour le Québec.

CC-Outreach est un écosystème conçu pour les agences de services ciblant les entreprises locales au Québec (construction, toiture, excavation, CVC, électricité, plomberie, etc.). Le système automatise le pipeline complet, de la détection de leads sur Google Maps à l'envoi d'emails ultra-personnalisés.

## 🛠️ Fonctionnalités Clefs

- **Acquisition & Normalisation** : Import depuis Google Maps, déduplication intelligente et gestion des entreprises/contacts.
- **Enrichissement de Données** : Collecte automatique d'informations publiques, réseaux sociaux et signaux métiers.
- **Audit Web Automatisé** : Mini-crawler analysant le site web du prospect (SEO, UX, contenu, structure).
- **Scoring IA Multi-critères** : Évaluation du "fit", de l'urgence, et des opportunités digitales.
- **Génération d'Outreach Personnalisé** : Création d'angles d'approche spécifiques et de drafts d'emails bilingues (FR/EN) via IA.
- **Intégration Gmail & CRM** : Suivi des conversations, rappels et gestion du pipeline commercial.

## 🏗️ Architecture (Monorepo)

Le projet utilise une architecture modulaire avec **Turbo**, **NestJS**, **Prisma** et **pnpm-workspaces**.

- `apps/api` : Backend principal NestJS (API REST, Auth, Business logic).
- `apps/worker` : Workers asynchrones pour l'enrichissement, l'audit et l'IA (BullMQ).
- `apps/scheduler` : Gestionnaire de tâches planifiées.
- `packages/database` : Couche de données partagée avec Prisma.
- `packages/integrations` : Clients pour Google API, Apify, Gmail, Telegram/Discord.
- `packages/prompt-library` : Bibliothèque de prompts centralisée pour l'IA.

## 🚀 Démarrage Rapide

### Pré-requis

- [Node.js](https://nodejs.org/) (>= 20.0.0)
- [pnpm](https://pnpm.io/) (>= 9.0.0)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/) (pour BullMQ)
- [Ollama](https://ollama.com/) (pour l'IA locale)

### Installation

1. Cloner le repo :
   ```bash
   git clone https://github.com/Endsi3g/cc-outreach.git
   cd cc-outreach
   ```

2. Installer les dépendances :
   ```bash
   pnpm install
   ```

3. Configurer l'environnement :
   ```bash
   cp .env.example .env
   # Éditer .env avec vos identifiants
   ```

4. Préparer la base de données :
   ```bash
   pnpm db:generate
   pnpm db:push
   ```

5. Lancer en mode développement :
   ```bash
   pnpm dev
   ```

## 🧪 Tests & Qualité

```bash
pnpm lint   # Linting avec Turbo
pnpm build  # Build complet de tous les packages/apps
pnpm test   # Suite de tests automatisés
```

## 📜 Licence

Privé - Tous droits réservés.
