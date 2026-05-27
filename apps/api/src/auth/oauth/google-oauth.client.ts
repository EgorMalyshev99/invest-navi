import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { OAuthProfile } from './oauth-profile.type';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USER_INFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

interface GoogleTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface GoogleUserInfo {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

@Injectable()
export class GoogleOAuthClient {
  constructor(private readonly configService: ConfigService) {}

  async exchangeCodeAndGetProfile(code: string, redirectUri: string): Promise<OAuthProfile> {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      throw new InternalServerErrorException('Google OAuth is not configured');
    }

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    });

    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    if (!tokenResponse.ok) {
      throw new InternalServerErrorException('Google token exchange failed');
    }

    const tokenPayload = (await tokenResponse.json()) as GoogleTokenResponse;

    const userResponse = await fetch(GOOGLE_USER_INFO_URL, {
      headers: { Authorization: `Bearer ${tokenPayload.access_token}` },
    });

    if (!userResponse.ok) {
      throw new InternalServerErrorException('Google user info request failed');
    }

    const profile = (await userResponse.json()) as GoogleUserInfo;
    const email = profile.email?.trim().toLowerCase();

    if (!email?.includes('@')) {
      throw new UnauthorizedException('Google account has no email');
    }

    if (profile.email_verified === false) {
      throw new UnauthorizedException('Google email is not verified');
    }

    return {
      providerUserId: profile.sub,
      email,
      name: profile.name?.trim() || null,
      avatarUrl: profile.picture?.trim() || null,
    };
  }
}
