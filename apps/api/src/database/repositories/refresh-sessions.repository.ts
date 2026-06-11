import { createHash, randomBytes, randomUUID } from 'node:crypto';

import { Inject, Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';

import { DRIZZLE } from '../drizzle.provider';
import { refreshSessions } from '../schema/refresh-sessions';

import type { DrizzleDB } from '../drizzle.provider';

export function hashRefreshToken(rawToken: string): string {
  return createHash('sha256').update(rawToken).digest('hex');
}

export function generateOpaqueRefreshToken(): string {
  return randomBytes(32).toString('base64url');
}

@Injectable()
export class RefreshSessionsRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async createSession(userId: string, expiresAt: Date, familyId?: string) {
    const rawToken = generateOpaqueRefreshToken();
    const tokenHash = hashRefreshToken(rawToken);
    const resolvedFamilyId = familyId ?? randomUUID();

    const [session] = await this.db
      .insert(refreshSessions)
      .values({
        userId,
        tokenHash,
        familyId: resolvedFamilyId,
        expiresAt,
      })
      .returning({
        id: refreshSessions.id,
        familyId: refreshSessions.familyId,
      });

    if (!session) {
      throw new Error('Failed to create refresh session');
    }

    return { rawToken, sessionId: session.id, familyId: session.familyId };
  }

  findByTokenHash(tokenHash: string) {
    return this.db.query.refreshSessions.findFirst({
      where: eq(refreshSessions.tokenHash, tokenHash),
    });
  }

  async revokeSession(sessionId: string) {
    await this.db
      .update(refreshSessions)
      .set({ revokedAt: new Date() })
      .where(and(eq(refreshSessions.id, sessionId), isNull(refreshSessions.revokedAt)));
  }

  async revokeFamily(familyId: string) {
    await this.db
      .update(refreshSessions)
      .set({ revokedAt: new Date() })
      .where(and(eq(refreshSessions.familyId, familyId), isNull(refreshSessions.revokedAt)));
  }
}
