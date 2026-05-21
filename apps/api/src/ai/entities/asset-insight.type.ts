import { Field, ObjectType } from '@nestjs/graphql';

import { AssetInsightSource } from './asset-insight-source.enum';

@ObjectType()
export class AssetInsight {
  @Field()
  symbol!: string;

  @Field(() => AssetInsightSource)
  source!: AssetInsightSource;

  @Field({ nullable: true })
  provider?: string;

  @Field()
  whatIs!: string;

  @Field()
  whatChanged!: string;

  @Field()
  whyMatters!: string;

  @Field(() => [String])
  risks!: string[];

  @Field()
  forInvestor!: string;

  @Field({ nullable: true })
  vsIndex?: string;
}
