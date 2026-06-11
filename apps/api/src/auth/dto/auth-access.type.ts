import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthAccess {
  @Field()
  accessToken!: string;
}
