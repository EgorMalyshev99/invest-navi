import { Field, Float, ObjectType } from '@nestjs/graphql';
import { MarketDataSource } from '@repo/api';

@ObjectType('Index')
export class MarketIndex {
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
