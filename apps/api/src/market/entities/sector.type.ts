import { Field, Float, ObjectType } from '@nestjs/graphql';
import { MarketDataSource } from '@repo/api';

@ObjectType('Sector')
export class Sector {
  @Field()
  code!: string;

  @Field()
  name!: string;

  @Field(() => Float)
  currentValue!: number;

  @Field(() => Float)
  changePercent!: number;

  @Field(() => MarketDataSource)
  dataSource!: MarketDataSource;
}
