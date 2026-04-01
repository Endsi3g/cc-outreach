---
trigger: always_on
---

# project.md

## Titre du projet

Plateforme de prospection B2B locale propulsée par IA pour le Québec, orientée agences de services, avec focus initial sur les entreprises de construction, toiture, excavation, HVAC, électricité, plomberie et portes/fenêtres. Le système doit permettre d’identifier des leads à partir de sources publiques, les enrichir, auditer leur présence web, générer des angles de prospection hautement personnalisés, produire des emails bilingues et suivre les conversations dans un CRM collaboratif.

## Objectif produit

Construire un système local-first, fiable, modulaire et extensible qui exécute le pipeline complet suivant:

1. Acquisition de leads depuis Google Maps et autres sources publiques.
2. Normalisation et déduplication des entreprises et contacts.
3. Enrichissement des fiches avec données publiques structurées.
4. Audit web automatisé (crawl HTML, métadonnées, pages clés, résumés, signaux SEO/UX).
5. Scoring multi-dimensionnel des prospects.
6. Génération d’angles de prospection ultra personnalisés.
7. Génération de drafts email bilingues.
8. Validation humaine optionnelle.
9. Envoi via Gmail personnel puis Google Workspace plus tard.
10. Synchronisation des threads et suivi CRM.

## Contraintes fondamentales

- Backend en Node.js + TypeScript avec NestJS pour une architecture modulaire et scalable.
- Base de données PostgreSQL locale au départ, puis portabilité vers Supabase/Postgres managé plus tard.
- ORM Prisma pour schéma typé, migrations et productivité sur PostgreSQL.
- Orchestration asynchrone avec BullMQ et Redis pour les tâches longues.
- IA locale via Ollama pour les tâches de génération/analyse dynamiques.
- Authentification: email/password + Google Sign-In + OAuth Gmail pour lecture/envoi de threads.
- Notifications: Telegram en priorité, Discord en option.
- Interface applicative en français; outreach généré en détection automatique FR/EN.
- Priorité produit: qualité de personnalisation, coût minimal, maintenabilité.

## Personae utilisateurs

### 1. Administrateur / fondateur

Utilise le système pour importer des leads, lancer l’enrichissement, réviser les drafts, envoyer les emails, suivre les réponses et gérer le pipeline commercial.

### 2. Collaborateur interne

Dispose des mêmes permissions que l’administrateur dans le MVP. Peut traiter les leads, revoir les audits, approuver des messages, suivre les threads et relancer.

### 3. IA de prospection

N’est pas un utilisateur humain. Sert d’orchestrateur analytique et rédactionnel sur des données publiques autorisées, avec garde-fous stricts de conformité et de vérifiabilité.

## Portée MVP

### Inclus

- Workspace partagé unique.
- Import Google Maps comme source primaire.
- Ingestion extensible de sites web d’entreprise, annuaires, registres publics, avis publics et pages LinkedIn publiques lorsque les signaux sont accessibles publiquement.
- Modèle lead = entreprise + contacts associés.
- Audit web mini-crawler.
- Scoring multi-sous-scores.
- Génération d’angles et de drafts email bilingues.
- Gmail OAuth pour envoi et lecture des threads.
- CRM avec pipeline, activités, reminders, owner, notes, threads et analytics de base.
- Notifications Telegram/Discord.
- Journalisation détaillée des actions système.

### Exclus au MVP

- SMS, cold call, DM et autres canaux multicanaux.
- Multi-workspace / multi-tenant complet.
- Mockups automatiques ou génération de sites pour les prospects.
- Scraping profond non nécessaire de réseaux nécessitant authentification.
- Déploiement multi-région.

## Principes produit

- Local-first avant cloud-first.
- Preuve avant personnalisation: aucune affirmation commerciale ne doit être inventée.
- Chaque insight proposé au prospect doit être traçable à une source collectée.
- Chaque donnée personnelle stockée doit avoir une source et une finalité documentée.
- Le système doit rester portable et non bloqué à un fournisseur cloud spécifique.
- Le système doit rester utilisable par un non-spécialiste sur le plan opérationnel.

## Architecture logique

Le système est composé de cinq couches:

1. **API applicative**: expose les endpoints NestJS pour auth, leads, CRM, campagnes, paramètres et observabilité.
2. **Workers asynchrones**: exécutent ingestion, enrichissement, crawl, scoring, génération IA, notifications, sync Gmail et analytics.
3. **Stockage**: PostgreSQL pour les données métier, Redis pour les queues/jobs, blob storage optionnel plus tard pour snapshots et exports.
4. **Intégrations externes**: Google OAuth/Gmail, Telegram, Discord, sources publiques et crawlers web.
5. **AI gateway**: abstraction locale vers Ollama, extensible à Groq ou autre fournisseur plus tard.

## Choix technologiques

| Domaine | Choix | Raison |
|---|---|---|
| Framework backend | NestJS | Architecture modulaire, scalable, TypeScript-native. |
| ORM | Prisma | Schéma typé, migrations, PostgreSQL, DX solide. |
| Base de données | PostgreSQL | Relationnel, robuste, compatible local et Supabase. |
| Jobs | BullMQ | Queues, retries, delayed jobs, workers. |
| Cache / broker | Redis | Nécessaire pour BullMQ et utile pour locks/quotas. |
| Email | Gmail API | Envoi et lecture de threads via OAuth Google. |
| Notifications | Telegram prioritaire, Discord secondaire | Faciles à intégrer pour alertes opérationnelles. |
| IA locale | Ollama | Local, extensible, orienté génération/analyse. |

## Modules NestJS

### 1. auth

Gère l’inscription email/password, la session, Google Sign-In et l’association des comptes OAuth.

### 2. users

Gère le profil utilisateur, la langue d’interface, les préférences de notifications et les paramètres personnels.

### 3. workspace

Gère le workspace partagé unique du MVP, ses membres, ses paramètres et ses providers connectés.

### 4. leads

Expose la vue métier principale du lead, qui agrège entreprise, contacts, scores, statut pipeline et historique.

### 5. companies

Gère les données structurées de l’entreprise: nom, domaine, niche, région, site, notes, maturité digitale.

### 6. contacts

Gère les contacts nominatifs, leurs rôles, emails, téléphones publics, sources et niveaux de confiance.

### 7. sources

Stocke chaque source brute, URL, type, timestamp, hash, payload normalisé et traçabilité.

### 8. enrichment

Orchestre la collecte et normalisation depuis Google Maps, annuaires, registres, avis et signaux publics additionnels.

### 9. website-audit

Mini crawler pour homepage et pages clés; récupère HTML, title, meta description, headings, internal links, tech hints, signaux SEO/UX et génère un résumé d’audit.

### 10. scoring

Calcule les sous-scores et le score global: fit niche, urgence, quality gap web, SEO gap, contenu, maturité digitale/IA, confidence de personnalisation, confidence de contactabilité.

### 11. ai

Abstraction centralisée vers Ollama; gère prompts, outputs JSON, validation de schéma, retries, coût logique et fallback futur.

### 12. outreach

Gère les angles de prospection, les drafts, les séquences email, la détection de langue et les variantes de ton.

### 13. gmail

Gère OAuth Gmail, brouillons, envoi, sync des threads, statuts, replies, labels et quotas.

### 14. campaigns

Regroupe l’exécution des campagnes ou lots d’envoi, sans devenir l’entité maîtresse du domaine.

### 15. crm

Gère pipeline, owner, next action, statut, notes, qualification, perte/gain et vue commerciale.

### 16. activities

Journal immuable des événements: import, enrichissement, score, draft, approval, envoi, réponse, note, changement de stage.

### 17. reminders

Rappels basés sur dates, absence de réponse, SLA interne et actions à venir.

### 18. notifications

Envoie notifications Telegram ou Discord pour approvals, erreurs, replies, quotas et jobs critiques.

### 19. analytics

Consolide sends, replies, thread health, open/click si activé, time-to-reply, lead status velocity et performance d’angles.

### 20. tags

Taxonomie libre pour niche, priorité, région, service, qualité web, etc.

### 21. search

Recherche texte et filtres multicritères sur entreprises, contacts, statuts et activités.

### 22. files

Exports CSV, snapshots d’audit, pièces jointes et stockage local initial.

### 23. jobs

Bridge interne avec BullMQ, déclaration des queues, payloads et politiques de retry.

### 24. compliance

Applique les règles de conformité, audits d’usage, traçabilité des sources, red flags et blocages automatiques.

### 25. health

Endpoints de santé pour API, PostgreSQL, Redis, Ollama, Gmail.

### 26. observability

Logs structurés, métriques d’exécution, corrélation de jobs, diagnostics et alerting interne.

## Pipeline métier détaillé

### Étape 1. Ingestion

Le système importe des entreprises depuis Google Maps et stocke chaque enregistrement source brut, puis normalise les données en Company + Contact si applicable.

### Étape 2. Déduplication

Déduplication par domaine, téléphone, nom + ville + catégorie et autres heuristiques. Un lead final représente l’entreprise, avec ses contacts rattachés.

### Étape 3. Enrichissement

Le système collecte:

- site officiel,
- pages publiques de contact/équipe,
- annuaires,
- registres,
- avis,
- signaux de présence de contenu,
- signaux de maturité numérique,
- signaux publics de personnes clés.

Chaque donnée enrichie doit être stockée avec source, URL, méthode d’extraction et niveau de confiance.

### Étape 4. Audit web

Le mini crawler visite
