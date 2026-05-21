import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => String, { description: 'Basic health check for GraphQL API' })
  ping(): string {
    return 'pong';
  }
}
