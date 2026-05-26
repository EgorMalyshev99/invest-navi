import { Field, InputType, Int } from '@nestjs/graphql';

import { DiaryAction } from '../../diary/dto/diary-action.enum';
import { DiaryHorizon } from '../../diary/dto/diary-horizon.enum';

@InputType()
export class DiaryHypothesisFeedbackInput {
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

  @Field({ nullable: true, defaultValue: 'ru' })
  locale?: string;
}
