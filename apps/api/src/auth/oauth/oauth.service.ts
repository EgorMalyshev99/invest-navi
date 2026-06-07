import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GoogleOAuthClient } from './google-oauth.client';
import { OAUTH_CALLBACK_PATHS, type OAuthProviderId } from './oauth-providers';
import { YandexOAuthClient } from './yandex-oauth.client';
import { parseAppOrigins } from '../../config/app-origins';
import { OAuthAccountsRepository } from '../../database/repositories/oauth-accounts.repository';
import { UsersRepository } from '../../database/repositories/users.repository';
import { AuthService } from '../auth.service';
import { AuthTokens } from '../dto/auth-tokens.type';

import type { OAuthProfile } from './oauth-profile.type';

@Injectable()
export class OAuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly yandexOAuthClient: YandexOAuthClient,
    private readonly googleOAuthClient: GoogleOAuthClient,
    private readonly oauthAccountsRepository: OAuthAccountsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
  ) {}

  async completeYandexLogin(code: string, redirectUri: string): Promise<AuthTokens> {
    return this.completeProviderLogin('yandex', code, redirectUri, () =>
      this.yandexOAuthClient.exchangeCodeAndGetProfile(code.trim(), redirectUri),
    );
  }

  async completeGoogleLogin(code: string, redirectUri: string): Promise<AuthTokens> {
    return this.completeProviderLogin('google', code, redirectUri, () =>
      this.googleOAuthClient.exchangeCodeAndGetProfile(code.trim(), redirectUri),
    );
  }

  private async completeProviderLogin(
    provider: OAuthProviderId,
    code: string,
    redirectUri: string,
    resolveProfile: () => Promise<OAuthProfile>,
  ): Promise<AuthTokens> {
    if (!code?.trim()) {
      throw new BadRequestException('Authorization code is required');
    }

    this.assertAllowedRedirectUri(redirectUri);

    const profile = await resolveProfile();

    const { providerUserId, email, name, avatarUrl } = profile;

    const linked = await this.oauthAccountsRepository.findByProvider(provider, providerUserId);
    if (linked) {
      const user = await this.usersRepository.findById(linked.userId);
      if (!user?.email) {
        throw new UnauthorizedException('Linked user not found');
      }
      return this.authService.issueTokensForUser(user.id, user.email);
    }

    const existingByEmail = await this.usersRepository.findByEmail(email);
    if (existingByEmail?.email) {
      await this.oauthAccountsRepository.create({
        userId: existingByEmail.id,
        provider,
        providerUserId,
        providerEmail: email,
      });
      return this.authService.issueTokensForUser(existingByEmail.id, existingByEmail.email);
    }

    const [created] = await this.usersRepository.create({
      email,
      name,
      avatarUrl,
    });

    if (!created?.email) {
      throw new UnauthorizedException('Unable to create user');
    }

    await this.oauthAccountsRepository.create({
      userId: created.id,
      provider,
      providerUserId,
      providerEmail: email,
    });

    return this.authService.issueTokensForUser(created.id, created.email);
  }

  private assertAllowedRedirectUri(redirectUri: string): void {
    const normalized = redirectUri?.trim();
    if (!normalized) {
      throw new BadRequestException('redirectUri is required');
    }

    const allowed = this.buildAllowedRedirectUris();
    if (!allowed.includes(normalized)) {
      throw new BadRequestException('redirectUri is not allowed');
    }
  }

  private buildAllowedRedirectUris(): string[] {
    const origins = parseAppOrigins({
      LANDING_URL: this.configService.get<string>('LANDING_URL'),
      DASHBOARD_URL: this.configService.get<string>('DASHBOARD_URL'),
    });

    const unique = new Set<string>();
    for (const origin of origins) {
      const base = origin.replace(/\/$/, '');
      for (const path of Object.values(OAUTH_CALLBACK_PATHS)) {
        unique.add(`${base}${path}`);
      }
    }
    return [...unique];
  }
}
