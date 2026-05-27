import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthOAuthController } from './auth-oauth.controller';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { GoogleOAuthClient } from './oauth/google-oauth.client';
import { OAuthService } from './oauth/oauth.service';
import { YandexOAuthClient } from './oauth/yandex-oauth.client';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [JwtModule.register({}), PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [AuthOAuthController],
  providers: [
    AuthResolver,
    AuthService,
    OAuthService,
    YandexOAuthClient,
    GoogleOAuthClient,
    JwtStrategy,
  ],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}
