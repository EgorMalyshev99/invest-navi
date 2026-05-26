import { Field, Float, ObjectType } from '@nestjs/graphql';
import { InstrumentType } from '@repo/api';

@ObjectType()
export class PortfolioPosition {
  @Field()
  id!: string;

  @Field()
  assetSymbol!: string;

  @Field({ nullable: true })
  assetName?: string;

  @Field(() => InstrumentType, { nullable: true })
  instrumentType?: InstrumentType;

  @Field({ nullable: true })
  currency?: string;

  @Field(() => Float)
  quantity!: number;

  @Field(() => Float)
  entryPrice!: number;

  @Field()
  entryDate!: string;

  @Field({ nullable: true })
  goal?: string;

  @Field(() => Float, { nullable: true })
  currentPrice?: number;

  @Field(() => Float, { nullable: true })
  marketValue?: number;

  @Field(() => Float)
  costBasis!: number;

  @Field(() => Float, { nullable: true })
  unrealizedPl?: number;

  @Field(() => Float, { nullable: true })
  unrealizedPlPercent?: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
