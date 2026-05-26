import { Inject, Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { sql } from 'drizzle-orm';

import { DRIZZLE } from '../database';

import type { DrizzleDB } from '../database/drizzle.provider';

@Injectable()
export class DrizzleHealthIndicator extends HealthIndicator {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.db.execute(sql`SELECT 1`);
      return this.getStatus(key, true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Database unavailable';
      throw new HealthCheckError('Database check failed', this.getStatus(key, false, { message }));
    }
  }
}
