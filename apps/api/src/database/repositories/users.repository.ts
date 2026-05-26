import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { DRIZZLE, users } from '../index';

import type { DrizzleDB } from '../drizzle.provider';

@Injectable()
export class UsersRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  findByEmail(email: string) {
    return this.db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  findById(userId: string) {
    return this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });
  }

  create(values: typeof users.$inferInsert) {
    return this.db.insert(users).values(values).returning({
      id: users.id,
      email: users.email,
    });
  }

  update(userId: string, values: Partial<typeof users.$inferInsert>) {
    return this.db.update(users).set(values).where(eq(users.id, userId)).returning();
  }
}
