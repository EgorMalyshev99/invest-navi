import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GoogleOAuthClient } from './google-oauth.client';
import { OAUTH_CALLBACK_PATHS, type OAuthProviderId } from './oauth-providers';
import { YandexOAuthClient } from './yandex-oauth.client';
import { parseAppOrigins } from '../../config/app-origins';
import { OAuthAccountsRepository } from '../../database/repositories/oauth-accounts.repository';
import { UsersRepository } from '../../database/repositories/users.repository';
import { AuthService } from '../auth.service';
import type { AuthOAuthSession } from '../dto/auth-oauth-result.type';

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

  async completeYandexLogin(code: string, redirectUri: string): Promise<AuthOAuthSession> {
    return this.completeProviderLogin('yandex', code, redirectUri, () =>
      this.yandexOAuthClient.exchangeCodeAndGetProfile(code.trim(), redirectUri),
    );
  }

  async completeGoogleLogin(code: string, redirectUri: string): Promise<AuthOAuthSession> {
    return this.completeProviderLogin('google', code, redirectUri, () =>
      this.googleOAuthClient.exchangeCodeAndGetProfile(code.trim(), redirectUri),
    );
  }

  async linkYandexProvider(
    userId: string,
    code: string,
    redirectUri: string,
  ): Promise<{ linked: true }> {
    return this.linkProvider('yandex', userId, code, redirectUri, () =>
      this.yandexOAuthClient.exchangeCodeAndGetProfile(code.trim(), redirectUri),
    );
  }

  async linkGoogleProvider(
    userId: string,
    code: string,
    redirectUri: string,
  ): Promise<{ linked: true }> {
    return this.linkProvider('google', userId, code, redirectUri, () =>
      this.googleOAuthClient.exchangeCodeAndGetProfile(code.trim(), redirectUri),
    );
  }

  private async linkProvider(
    provider: OAuthProviderId,
    userId: string,
    code: string,
    redirectUri: string,
    resolveProfile: () => Promise<OAuthProfile>,
  ): Promise<{ linked: true }> {
    if (!code?.trim()) {
      throw new BadRequestException('Authorization code is required');
    }

    this.assertAllowedRedirectUri(redirectUri);

    const profile = await resolveProfile();
    const { providerUserId, email } = profile;

    const existingLink = await this.oauthAccountsRepository.findByProvider(
      provider,
      providerUserId,
    );
    if (existingLink) {
      if (existingLink.userId === userId) {
        return { linked: true };
      }
      throw new ConflictException('OAuth account is already linked to another user');
    }

    const userProviderLink = await this.oauthAccountsRepository.findByUserAndProvider(
      userId,
      provider,
    );
    if (userProviderLink) {
      return { linked: true };
    }

    await this.oauthAccountsRepository.create({
      userId,
      provider,
      providerUserId,
      providerEmail: email,
    });

    return { linked: true };
  }

  private async completeProviderLogin(
    provider: OAuthProviderId,
    code: string,
    redirectUri: string,
    resolveProfile: () => Promise<OAuthProfile>,
  ): Promise<AuthOAuthSession> {
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
      return this.issueOAuthResult(user.id, user.email, false);
    }

    const existingByEmail = await this.usersRepository.findByEmail(email);
    if (existingByEmail?.email) {
      await this.oauthAccountsRepository.create({
        userId: existingByEmail.id,
        provider,
        providerUserId,
        providerEmail: email,
      });
      return this.issueOAuthResult(existingByEmail.id, existingByEmail.email, false);
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

    return this.issueOAuthResult(created.id, created.email, true);
  }

  private async issueOAuthResult(
    userId: string,
    email: string,
    isNewUser: boolean,
  ): Promise<AuthOAuthSession> {
    const tokens = await this.authService.issueTokensForUser(userId, email);
    return {
      ...tokens,
      isNewUser,
    };
  }

  assertAllowedRedirectUri(redirectUri: string): void {
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
    const dashboardUrl = this.configService.get<string>('DASHBOARD_URL')?.trim();
    if (!dashboardUrl) {
      return [];
    }

    const origins = parseAppOrigins({ DASHBOARD_URL: dashboardUrl });
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
