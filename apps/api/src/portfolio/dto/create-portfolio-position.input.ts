import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class CreatePortfolioPositionInput {
  @Field()
  assetSymbol!: string;

  @Field(() => Float)
  quantity!: number;

  @Field(() => Float)
  entryPrice!: number;

  @Field({ description: 'ISO date YYYY-MM-DD' })
  entryDate!: string;

  @Field({ nullable: true })
  goal?: string;
}
