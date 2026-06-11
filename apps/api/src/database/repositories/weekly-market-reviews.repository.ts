import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

import { DRIZZLE } from '../drizzle.provider';
import { weeklyMarketReviews } from '../schema/weekly-market-reviews';

import type { DrizzleDB } from '../drizzle.provider';
import type { WeeklyReviewContent } from '@repo/api';

export interface WeeklyMarketReviewRecord {
  id: string;
  weekStart: Date;
  locale: string;
  content: WeeklyReviewContent;
  source: string;
  generatedAt: Date;
}

@Injectable()
export class WeeklyMarketReviewsRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  findByWeekAndLocale(weekStart: Date, locale: string) {
    return this.db.query.weeklyMarketReviews.findFirst({
      where: and(
        eq(weeklyMarketReviews.weekStart, weekStart),
        eq(weeklyMarketReviews.locale, locale),
      ),
    });
  }

  async upsertReview(input: {
    weekStart: Date;
    locale: string;
    content: WeeklyReviewContent;
    source: string;
  }): Promise<WeeklyMarketReviewRecord> {
    const existing = await this.findByWeekAndLocale(input.weekStart, input.locale);

    if (existing) {
      const [updated] = await this.db
        .update(weeklyMarketReviews)
        .set({
          content: input.content,
          source: input.source,
          generatedAt: new Date(),
        })
        .where(eq(weeklyMarketReviews.id, existing.id))
        .returning();

      if (!updated) {
        throw new Error('Failed to update weekly market review');
      }

      return this.toRecord(updated);
    }

    const [created] = await this.db
      .insert(weeklyMarketReviews)
      .values({
        weekStart: input.weekStart,
        locale: input.locale,
        content: input.content,
        source: input.source,
      })
      .returning();

    if (!created) {
      throw new Error('Failed to create weekly market review');
    }

    return this.toRecord(created);
  }

  private toRecord(row: typeof weeklyMarketReviews.$inferSelect): WeeklyMarketReviewRecord {
    return {
      id: row.id,
      weekStart: row.weekStart,
      locale: row.locale,
      content: row.content as WeeklyReviewContent,
      source: row.source,
      generatedAt: row.generatedAt,
    };
  }
}
