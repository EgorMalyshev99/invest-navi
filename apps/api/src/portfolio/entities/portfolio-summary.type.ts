import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

import { PortfolioAllocationSlice } from './portfolio-allocation-slice.type';
import { PortfolioRiskHint } from './portfolio-risk-hint.type';

@ObjectType()
export class PortfolioSummary {
  @Field(() => Int)
  positionsCount!: number;

  @Field(() => Float)
  totalCostBasis!: number;

  @Field(() => Float)
  totalMarketValue!: number;

  @Field(() => Float)
  totalUnrealizedPl!: number;

  @Field(() => Float, { nullable: true })
  totalUnrealizedPlPercent?: number;

  @Field(() => [PortfolioAllocationSlice])
  byInstrumentType!: PortfolioAllocationSlice[];

  @Field(() => [PortfolioAllocationSlice])
  bySymbol!: PortfolioAllocationSlice[];

  @Field(() => [PortfolioAllocationSlice])
  byCurrency!: PortfolioAllocationSlice[];

  @Field(() => [PortfolioRiskHint])
  riskHints!: PortfolioRiskHint[];
}
