import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

import { AssetInsightSource } from '../../ai/entities/asset-insight-source.enum';

@ObjectType()
export class DiaryRetrospective {
  @Field()
  entryId!: string;

  @Field()
  isReady!: boolean;

  @Field(() => Int)
  daysElapsed!: number;

  @Field(() => Float, { nullable: true })
  priceChangePercent?: number;

  @Field(() => Float, { nullable: true })
  indexChangePercent?: number;

  @Field()
  summary!: string;

  @Field(() => [String])
  questions!: string[];

  @Field(() => AssetInsightSource)
  source!: AssetInsightSource;

  @Field({ nullable: true })
  provider?: string;
}
