import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { AuthTokens } from './dto/auth-tokens.type';
import { OAuthCallbackInput } from './dto/oauth-callback.input';
import { OAuthService } from './oauth/oauth.service';

@Controller('auth/oauth')
export class AuthOAuthController {
  constructor(private readonly oauthService: OAuthService) {}

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('yandex')
  @HttpCode(200)
  completeYandex(@Body() body: OAuthCallbackInput): Promise<AuthTokens> {
    return this.oauthService.completeYandexLogin(body.code, body.redirectUri);
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('google')
  @HttpCode(200)
  completeGoogle(@Body() body: OAuthCallbackInput): Promise<AuthTokens> {
    return this.oauthService.completeGoogleLogin(body.code, body.redirectUri);
  }
}
