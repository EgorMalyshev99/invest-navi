import { Inject, Injectable } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';

import { DRIZZLE } from '../drizzle.provider';
import { portfolioPositions } from '../schema/portfolio-positions';

import type { DrizzleDB } from '../drizzle.provider';

@Injectable()
export class PortfolioPositionsRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  findByUserId(userId: string) {
    return this.db.query.portfolioPositions.findMany({
      where: eq(portfolioPositions.userId, userId),
      orderBy: desc(portfolioPositions.createdAt),
    });
  }

  findByIdForUser(positionId: string, userId: string) {
    return this.db.query.portfolioPositions.findFirst({
      where: and(eq(portfolioPositions.id, positionId), eq(portfolioPositions.userId, userId)),
    });
  }

  create(values: typeof portfolioPositions.$inferInsert) {
    return this.db.insert(portfolioPositions).values(values).returning();
  }

  update(
    positionId: string,
    userId: string,
    values: Partial<typeof portfolioPositions.$inferInsert>,
  ) {
    return this.db
      .update(portfolioPositions)
      .set({ ...values, updatedAt: new Date() })
      .where(and(eq(portfolioPositions.id, positionId), eq(portfolioPositions.userId, userId)))
      .returning();
  }

  delete(positionId: string, userId: string) {
    return this.db
      .delete(portfolioPositions)
      .where(and(eq(portfolioPositions.id, positionId), eq(portfolioPositions.userId, userId)))
      .returning({ id: portfolioPositions.id });
  }
}
