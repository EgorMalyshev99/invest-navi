import { Field, ObjectType } from '@nestjs/graphql';

import { AssetInsightSource } from './asset-insight-source.enum';

@ObjectType()
export class BondInsight {
  @Field()
  symbol!: string;

  @Field()
  name!: string;

  @Field(() => AssetInsightSource)
  source!: AssetInsightSource;

  @Field({ nullable: true })
  provider?: string;

  @Field()
  overview!: string;

  @Field()
  couponAndMaturity!: string;

  @Field()
  yieldContext!: string;

  @Field()
  rateSensitivity!: string;

  @Field(() => [String])
  risks!: string[];

  @Field(() => [String])
  questionsBeforeBuy!: string[];

  @Field({ nullable: true })
  liquidityNote?: string;
}
