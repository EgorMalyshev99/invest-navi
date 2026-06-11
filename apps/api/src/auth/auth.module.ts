import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthOAuthController } from './auth-oauth.controller';
import { AuthRestController } from './auth-rest.controller';
import { AuthResolver } from './auth.resolver';
import { AuthCookieService } from './lib/auth-cookie.service';
import { AuthService } from './auth.service';
import { GoogleOAuthClient } from './oauth/google-oauth.client';
import { OAuthService } from './oauth/oauth.service';
import { YandexOAuthClient } from './oauth/yandex-oauth.client';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [JwtModule.register({}), PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [AuthOAuthController, AuthRestController],
  providers: [
    AuthResolver,
    AuthService,
    AuthCookieService,
    OAuthService,
    YandexOAuthClient,
    GoogleOAuthClient,
    JwtStrategy,
  ],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}
