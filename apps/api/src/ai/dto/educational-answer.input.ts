import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class EducationalAnswerInput {
  @Field()
  question!: string;

  @Field({ nullable: true, defaultValue: 'ru' })
  locale?: string;
}
