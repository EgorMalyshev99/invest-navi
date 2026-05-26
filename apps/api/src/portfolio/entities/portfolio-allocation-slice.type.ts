import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PortfolioAllocationSlice {
  @Field()
  key!: string;

  @Field({ nullable: true })
  label?: string;

  @Field(() => Float)
  weightPercent!: number;

  @Field(() => Float)
  value!: number;
}
