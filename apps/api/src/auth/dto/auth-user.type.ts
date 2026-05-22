import { Field, ObjectType } from '@nestjs/graphql';

import { KnowledgeLevel } from './knowledge-level.enum';
import { PreferredLocale } from './preferred-locale.enum';

@ObjectType()
export class AuthUser {
  @Field()
  userId!: string;

  @Field()
  email!: string;

  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field(() => KnowledgeLevel)
  knowledgeLevel!: KnowledgeLevel;

  @Field(() => PreferredLocale)
  preferredLocale!: PreferredLocale;
}
