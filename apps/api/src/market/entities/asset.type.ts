import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { InstrumentType, MarketDataSource } from '@repo/api';

@ObjectType('Asset')
export class Asset {
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

  @Field(() => InstrumentType)
  instrumentType!: InstrumentType;

  @Field({ nullable: true })
  currency?: string;

  @Field({ nullable: true })
  figi?: string;

  @Field({ nullable: true, description: 'Tinkoff sector key when available' })
  sector?: string;

  @Field(() => Float, {
    nullable: true,
    description: 'Indicative dividend yield % from T-Invest when available',
  })
  dividendYieldPercent?: number;

  @Field(() => MarketDataSource)
  dataSource!: MarketDataSource;
}
