import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

import { DiaryAction } from '../dto/diary-action.enum';
import { DiaryHorizon } from '../dto/diary-horizon.enum';
import { DiaryStatus } from '../dto/diary-status.enum';

@ObjectType()
export class DiaryEntry {
  @Field()
  id!: string;

  @Field()
  assetSymbol!: string;

  @Field(() => DiaryAction)
  action!: DiaryAction;

  @Field(() => DiaryHorizon)
  horizon!: DiaryHorizon;

  @Field({ nullable: true })
  rationale?: string;

  @Field({ nullable: true })
  risks?: string;

  @Field({ nullable: true })
  successCriteria?: string;

  @Field({ nullable: true })
  failureCriteria?: string;

  @Field(() => Int, { nullable: true })
  confidence?: number;

  @Field(() => DiaryStatus)
  status!: DiaryStatus;

  @Field(() => Float, { nullable: true })
  snapshotPrice?: number;

  @Field(() => Float, { nullable: true })
  snapshotIndexValue?: number;

  @Field({ nullable: true })
  reviewAt?: Date;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
