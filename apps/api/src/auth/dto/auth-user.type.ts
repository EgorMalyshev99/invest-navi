import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthUser {
  @Field()
  userId!: string;

  @Field()
  email!: string;
}
