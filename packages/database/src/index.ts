/**
 * Ce fichier est un proxy vers @prisma/client.
 * PrismaClient et les types associés sont disponibles APRÈS avoir exécuté:
 *   pnpm db:generate   (alias: prisma generate)
 *
 * Avant cette étape, l'IDE peut signaler des erreurs sur ce fichier — c'est normal.
 */

// @ts-expect-error — PrismaClient est généré dynamiquement, disponible après `prisma generate`
export { PrismaClient } from '@prisma/client';

/** Singleton Prisma pour les scripts / seed (non utilisé dans NestJS — utiliser PrismaService) */
export function getPrismaClient() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient: PC } = require('@prisma/client');
  return new PC() as unknown;
}
