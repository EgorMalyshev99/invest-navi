import { Field, InputType } from '@nestjs/graphql';

import { KnowledgeLevel } from './knowledge-level.enum';
import { PreferredLocale } from './preferred-locale.enum';

@InputType()
export class UpdateProfileInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => KnowledgeLevel, { nullable: true })
  knowledgeLevel?: KnowledgeLevel;

  @Field(() => PreferredLocale, { nullable: true })
  preferredLocale?: PreferredLocale;
}
