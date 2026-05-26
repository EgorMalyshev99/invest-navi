import { Field, Float, ObjectType } from '@nestjs/graphql';

import { PortfolioRiskSeverity } from '../dto/portfolio-risk-severity.enum';

@ObjectType()
export class PortfolioRiskHint {
  @Field()
  code!: string;

  @Field(() => PortfolioRiskSeverity)
  severity!: PortfolioRiskSeverity;

  @Field({ nullable: true })
  symbol?: string;

  @Field(() => Float, { nullable: true })
  weightPercent?: number;
}
