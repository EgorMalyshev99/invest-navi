import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthTokens } from './dto/auth-tokens.type';
import { AuthUser } from './dto/auth-user.type';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { GqlAuthGuard } from './guards/gql-auth.guard';

import type { AuthenticatedUser } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Mutation(() => AuthTokens)
  login(@Args('input') input: LoginInput): Promise<AuthTokens> {
    return this.authService.login(input.email, input.password);
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Mutation(() => AuthTokens)
  register(@Args('input') input: RegisterInput): Promise<AuthTokens> {
    return this.authService.register(input);
  }

  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @Mutation(() => AuthTokens)
  refreshTokens(@Args('refreshToken') refreshToken: string): Promise<AuthTokens> {
    return this.authService.refreshTokens(refreshToken);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => AuthUser)
  me(@CurrentUser() user: AuthenticatedUser): Promise<AuthUser> {
    return this.authService.getProfile(user.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => AuthUser)
  updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: UpdateProfileInput,
  ): Promise<AuthUser> {
    return this.authService.updateProfile(user.userId, input);
  }
}
