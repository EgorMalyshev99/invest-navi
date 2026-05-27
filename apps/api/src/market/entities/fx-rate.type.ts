import { Field, Float, ObjectType } from '@nestjs/graphql';
import { MarketDataSource } from '@repo/api';

@ObjectType('FxRate')
export class FxRate {
  @Field()
  code!: string;

  @Field()
  name!: string;

  @Field(() => Float)
  currentValue!: number;

  @Field(() => Float)
  changePercent!: number;

  @Field(() => Float)
  valueToday!: number;

  @Field(() => MarketDataSource)
  dataSource!: MarketDataSource;
}
