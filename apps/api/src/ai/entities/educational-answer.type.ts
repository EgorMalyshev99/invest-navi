import { Field, ObjectType } from '@nestjs/graphql';

import { AssetInsightSource } from './asset-insight-source.enum';

@ObjectType()
export class EducationalAnswer {
  @Field()
  answer!: string;

  @Field(() => AssetInsightSource)
  source!: AssetInsightSource;

  @Field({ nullable: true })
  provider?: string;
}
