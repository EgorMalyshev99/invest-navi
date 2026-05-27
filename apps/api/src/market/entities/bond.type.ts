import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { MarketDataSource } from '@repo/api';

@ObjectType('Bond')
export class Bond {
  @Field()
  symbol!: string;

  @Field()
  name!: string;

  @Field(() => Float)
  lastPrice!: number;

  @Field(() => Float)
  changePercent!: number;

  @Field(() => Int)
  lotSize!: number;

  @Field(() => Float)
  valueToday!: number;

  @Field(() => Float, { nullable: true, description: 'Annual coupon rate %' })
  couponPercent?: number;

  @Field({ nullable: true, description: 'Maturity date YYYY-MM-DD' })
  maturityDate?: string;

  @Field(() => Float, { nullable: true, description: 'Yield at current price %' })
  yieldAtPrice?: number;

  @Field(() => Float, { nullable: true })
  faceValue?: number;

  @Field({ nullable: true })
  currency?: string;

  @Field(() => MarketDataSource)
  dataSource!: MarketDataSource;
}
