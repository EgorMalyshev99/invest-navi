import { Inject, Injectable } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';

import { DRIZZLE, diaryEntries } from '../index';

import type { DrizzleDB } from '../drizzle.provider';

@Injectable()
export class DiaryEntriesRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  findByUserId(userId: string, limit = 50) {
    return this.db.query.diaryEntries.findMany({
      where: eq(diaryEntries.userId, userId),
      orderBy: desc(diaryEntries.createdAt),
      limit,
    });
  }

  findByIdForUser(entryId: string, userId: string) {
    return this.db.query.diaryEntries.findFirst({
      where: and(eq(diaryEntries.id, entryId), eq(diaryEntries.userId, userId)),
    });
  }

  create(values: typeof diaryEntries.$inferInsert) {
    return this.db.insert(diaryEntries).values(values).returning();
  }

  update(entryId: string, userId: string, values: Partial<typeof diaryEntries.$inferInsert>) {
    return this.db
      .update(diaryEntries)
      .set({ ...values, updatedAt: new Date() })
      .where(and(eq(diaryEntries.id, entryId), eq(diaryEntries.userId, userId)))
      .returning();
  }
}
