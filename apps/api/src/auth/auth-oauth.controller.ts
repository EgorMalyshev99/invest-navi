import { Body, Controller, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { AuthOAuthResult } from './dto/auth-oauth-result.type';
import { OAuthCallbackInput } from './dto/oauth-callback.input';
import { JwtAuthGuard, RestCurrentUser } from './guards/jwt-auth.guard';
import { AuthCookieService } from './lib/auth-cookie.service';
import { OAuthService } from './oauth/oauth.service';

import type { AuthenticatedUser } from './auth.service';
import type { Response } from 'express';

@ApiTags('auth')
@Controller('auth/oauth')
export class AuthOAuthController {
  constructor(
    private readonly oauthService: OAuthService,
    private readonly authCookieService: AuthCookieService,
  ) {}

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @ApiOperation({ summary: 'Complete Yandex OAuth login' })
  @Post('yandex')
  @HttpCode(200)
  async completeYandex(
    @Body() body: OAuthCallbackInput,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthOAuthResult> {
    const result = await this.oauthService.completeYandexLogin(body.code, body.redirectUri);
    this.authCookieService.setRefreshCookie(res, result.refreshToken);
    return { accessToken: result.accessToken, isNewUser: result.isNewUser };
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('google')
  @HttpCode(200)
  async completeGoogle(
    @Body() body: OAuthCallbackInput,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthOAuthResult> {
    const result = await this.oauthService.completeGoogleLogin(body.code, body.redirectUri);
    this.authCookieService.setRefreshCookie(res, result.refreshToken);
    return { accessToken: result.accessToken, isNewUser: result.isNewUser };
  }

  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('yandex/link')
  @HttpCode(200)
  linkYandex(
    @RestCurrentUser() user: AuthenticatedUser,
    @Body() body: OAuthCallbackInput,
  ): Promise<{ linked: true }> {
    return this.oauthService.linkYandexProvider(user.userId, body.code, body.redirectUri);
  }

  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('google/link')
  @HttpCode(200)
  linkGoogle(
    @RestCurrentUser() user: AuthenticatedUser,
    @Body() body: OAuthCallbackInput,
  ): Promise<{ linked: true }> {
    return this.oauthService.linkGoogleProvider(user.userId, body.code, body.redirectUri);
  }
}
