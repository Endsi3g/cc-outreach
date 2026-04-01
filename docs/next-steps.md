# Next Steps — Llama Sales OS Roadmap

Ce document détaille les étapes à venir pour finaliser les phases 4 et 5, ainsi que le lancement de la phase 5b (Dashboard).

---

## 🚀 Phase 4 — Gmail & CRM (Finalisation)
*Statut : Backend implémenté, prêt pour tests d'intégration.*

### 🛠️ Travaux réalisés
- **Packages/Integrations** : Implémentation de `GmailClient`, `TelegramClient` et `DiscordClient`.
- **Apps/Worker** : Implémentation complète du `GmailWorkerProcessor` (envoi et synchronisation des threads) et du `NotificationWorkerProcessor`.
- **Apps/API** : Activation des modules `GmailModule` (OAuth, send, sync), `CrmModule`, `RemindersModule` et `NotificationsModule`.

---

## 📈 Phase 5 — Analytics, Observabilité & Hardening
*Objectif : Fiabiliser le système et offrir une visibilité sur les performances.*

### 1. Modules API à implémenter
- **AnalyticsModule** : Consolider les statistiques d'envoi, de réponse et de conversion par utilisateur et par campagne.
- **SearchModule** : Recherche plein texte performante sur les leads, entreprises et activités via PostgreSQL (éventuellement pg_trgm).
- **FilesModule** : Gestion des exports CSV et des snapshots d'audit.
- **ObservabilityModule** : Logs structurés (Winston/Pino), corrélation de jobs et monitoring des quotas Gmail.

### 2. Tâches Scheduler (Apps/Scheduler)
- Nettoyage périodique des logs et des locks Redis.
- Rapports quotidiens de performance envoyés par Telegram.
- Vérification de l'état de santé des services (Health Checks).

---

## 🖥️ Phase 5b — Dashboard Next.js Minimal
*Objectif : Fournir une interface utilisateur premium (Glassmorphism) pour piloter l'OS.*

### 1. Scaffold & Architecture
- **Framework** : Next.js 14 (App Router).
- **Styling** : Vanilla CSS / CSS Modules (Aesthétique premium "Llama").
- **API Client** : Client typé utilisant les DTOs partagés du monorepo.

### 2. Pages à développer
- `/leads` : Table des prospects avec filtres et actions rapides.
- `/leads/[id]` : Vue détaillée (Audit, Historique, Contacts).
- `/drafts` & `/drafts/[id]` : Gestion et validation des messages générés par l'IA.
- `/crm` : Pipeline commercial (Drag & Drop ou liste priorisée).
- `/analytics` : Tableaux de bord de performance.
- `/settings` : Configuration OAuth Gmail, Tokens Telegram/Discord.

---

## 🛡️ Hardening & Qualité
- **Tests E2E** : Valider le flux complet du crawl à l'envoi Gmail.
- **Sécurité** : Chiffrement des tokens OAuth en base de données (AES-256).
- **Limites de taux** : Affiner le Throttler pour prévenir les abus.
