import { Field, ObjectType } from '@nestjs/graphql';

import { AssetInsightSource } from './asset-insight-source.enum';

@ObjectType()
export class DiaryHypothesisFeedback {
  @Field()
  summary!: string;

  @Field(() => [String])
  strengths!: string[];

  @Field(() => [String])
  gaps!: string[];

  @Field(() => [String])
  questions!: string[];

  @Field(() => AssetInsightSource)
  source!: AssetInsightSource;

  @Field({ nullable: true })
  provider?: string;
}
