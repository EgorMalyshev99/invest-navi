import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthAccess } from './dto/auth-access.type';
import { AuthUser } from './dto/auth-user.type';
import { LoginInput } from './dto/login.input';
import { OAuthProvider } from './dto/oauth-provider.enum';
import { RegisterInput } from './dto/register.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { AuthCookieService } from './lib/auth-cookie.service';

import type { AuthenticatedUser } from './auth.service';
import type { Response } from 'express';

interface GqlContext {
  res: Response;
}

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly authCookieService: AuthCookieService,
  ) {}

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Mutation(() => AuthAccess)
  async login(
    @Args('input') input: LoginInput,
    @Context() context: GqlContext,
  ): Promise<AuthAccess> {
    const session = await this.authService.login(input.email, input.password);
    this.authCookieService.setRefreshCookie(context.res, session.refreshToken);
    return { accessToken: session.accessToken };
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Mutation(() => AuthAccess)
  async register(
    @Args('input') input: RegisterInput,
    @Context() context: GqlContext,
  ): Promise<AuthAccess> {
    const session = await this.authService.register(input);
    this.authCookieService.setRefreshCookie(context.res, session.refreshToken);
    return { accessToken: session.accessToken };
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

  @UseGuards(GqlAuthGuard)
  @Mutation(() => AuthUser)
  unlinkOAuthProvider(
    @CurrentUser() user: AuthenticatedUser,
    @Args('provider', { type: () => OAuthProvider }) provider: OAuthProvider,
  ): Promise<AuthUser> {
    return this.authService.unlinkOAuthProvider(user.userId, provider);
  }
}
