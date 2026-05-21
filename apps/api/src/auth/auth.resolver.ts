import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthService, AuthenticatedUser } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthTokens } from './dto/auth-tokens.type';
import { AuthUser } from './dto/auth-user.type';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { GqlAuthGuard } from './guards/gql-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthTokens)
  login(@Args('input') input: LoginInput): Promise<AuthTokens> {
    return this.authService.login(input.email, input.password);
  }

  @Mutation(() => AuthTokens)
  register(@Args('input') input: RegisterInput): Promise<AuthTokens> {
    return this.authService.register(input);
  }

  @Mutation(() => AuthTokens)
  refreshTokens(@Args('refreshToken') refreshToken: string): Promise<AuthTokens> {
    return this.authService.refreshTokens(refreshToken);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => AuthUser)
  me(@CurrentUser() user: AuthenticatedUser): AuthUser {
    return {
      userId: user.userId,
      email: user.email,
    };
  }
}
