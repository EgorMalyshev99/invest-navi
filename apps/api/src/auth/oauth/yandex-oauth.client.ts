import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { OAuthProfile } from './oauth-profile.type';

const YANDEX_TOKEN_URL = 'https://oauth.yandex.ru/token';
const YANDEX_USER_INFO_URL = 'https://login.yandex.ru/info?format=json';

export interface YandexTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface YandexUserInfo {
  id: string;
  login: string;
  default_email?: string;
  emails?: string[];
  real_name?: string;
  display_name?: string;
  default_avatar_id?: string;
}

@Injectable()
export class YandexOAuthClient {
  constructor(private readonly configService: ConfigService) {}

  async exchangeCode(code: string, redirectUri: string): Promise<YandexTokenResponse> {
    const clientId = this.configService.get<string>('YANDEX_CLIENT_ID');
    const clientSecret = this.configService.get<string>('YANDEX_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      throw new InternalServerErrorException('Yandex OAuth is not configured');
    }

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    });

    const response = await fetch(YANDEX_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    if (!response.ok) {
      throw new InternalServerErrorException('Yandex token exchange failed');
    }

    return (await response.json()) as YandexTokenResponse;
  }

  async exchangeCodeAndGetProfile(code: string, redirectUri: string): Promise<OAuthProfile> {
    const tokenResponse = await this.exchangeCode(code, redirectUri);
    const profile = await this.fetchUserInfo(tokenResponse.access_token);

    const email = YandexOAuthClient.resolveEmail(profile);
    if (!email) {
      throw new UnauthorizedException('Yandex account has no email');
    }

    return {
      providerUserId: String(profile.id),
      email,
      name: YandexOAuthClient.resolveName(profile),
      avatarUrl: YandexOAuthClient.resolveAvatarUrl(profile.default_avatar_id),
    };
  }

  async fetchUserInfo(accessToken: string): Promise<YandexUserInfo> {
    const response = await fetch(YANDEX_USER_INFO_URL, {
      headers: { Authorization: `OAuth ${accessToken}` },
    });

    if (!response.ok) {
      throw new InternalServerErrorException('Yandex user info request failed');
    }

    return (await response.json()) as YandexUserInfo;
  }

  static resolveAvatarUrl(avatarId: string | undefined): string | null {
    if (!avatarId) return null;
    return `https://avatars.yandex.net/get-yapic/${avatarId}/islands-200`;
  }

  static resolveEmail(profile: YandexUserInfo): string | null {
    const email = profile.default_email ?? profile.emails?.[0];
    if (email?.includes('@')) return email.trim().toLowerCase();
    if (profile.login) return `${profile.login.trim().toLowerCase()}@yandex.ru`;
    return null;
  }

  static resolveName(profile: YandexUserInfo): string | null {
    return (
      profile.real_name?.trim() || profile.display_name?.trim() || profile.login?.trim() || null
    );
  }
}
