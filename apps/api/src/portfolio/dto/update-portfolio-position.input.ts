import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class UpdatePortfolioPositionInput {
  @Field({ nullable: true })
  assetSymbol?: string;

  @Field(() => Float, { nullable: true })
  quantity?: number;

  @Field(() => Float, { nullable: true })
  entryPrice?: number;

  @Field({ nullable: true, description: 'ISO date YYYY-MM-DD' })
  entryDate?: string;

  @Field({ nullable: true })
  goal?: string;
}
