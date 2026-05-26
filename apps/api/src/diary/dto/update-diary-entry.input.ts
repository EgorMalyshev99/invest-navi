import { Field, InputType, Int } from '@nestjs/graphql';

import { DiaryAction } from './diary-action.enum';
import { DiaryHorizon } from './diary-horizon.enum';
import { DiaryStatus } from './diary-status.enum';

@InputType()
export class UpdateDiaryEntryInput {
  @Field(() => DiaryAction, { nullable: true })
  action?: DiaryAction;

  @Field(() => DiaryHorizon, { nullable: true })
  horizon?: DiaryHorizon;

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

  @Field(() => DiaryStatus, { nullable: true })
  status?: DiaryStatus;
}
