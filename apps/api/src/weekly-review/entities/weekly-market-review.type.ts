import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';

import { AssetInsightSource } from '../../ai/entities/asset-insight-source.enum';

@ObjectType()
export class WeeklyMarketReview {
  @Field(() => GraphQLISODateTime)
  weekStart!: Date;

  @Field()
  locale!: string;

  @Field()
  summary!: string;

  @Field(() => [String])
  sectors!: string[];

  @Field()
  bondsAndRub!: string;

  @Field(() => [String])
  events!: string[];

  @Field(() => [String])
  risksForNextWeek!: string[];

  @Field(() => AssetInsightSource)
  source!: AssetInsightSource;

  @Field({ nullable: true })
  provider?: string;

  @Field(() => GraphQLISODateTime)
  generatedAt!: Date;
}
