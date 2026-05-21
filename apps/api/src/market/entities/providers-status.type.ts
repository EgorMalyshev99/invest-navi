import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('MarketProvidersStatus')
export class MarketProvidersStatusType {
  @Field()
  moex!: boolean;

  @Field()
  tinkoff!: boolean;

  @Field(() => Int)
  cacheTtlSeconds!: number;
}
