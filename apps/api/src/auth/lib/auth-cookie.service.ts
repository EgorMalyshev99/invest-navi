import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { Request, Response } from 'express';

export const REFRESH_COOKIE_NAME = 'invest_navi_refresh';

@Injectable()
export class AuthCookieService {
  constructor(private readonly configService: ConfigService) {}

  setRefreshCookie(res: Response, rawToken: string): void {
    res.cookie(REFRESH_COOKIE_NAME, rawToken, this.cookieOptions());
  }

  clearRefreshCookie(res: Response): void {
    res.clearCookie(REFRESH_COOKIE_NAME, this.cookieOptions());
  }

  getRefreshTokenFromRequest(req: Request): string | undefined {
    const cookieValue = req.cookies?.[REFRESH_COOKIE_NAME];
    return typeof cookieValue === 'string' && cookieValue.trim().length > 0
      ? cookieValue.trim()
      : undefined;
  }

  private cookieOptions() {
    const isProduction = process.env.NODE_ENV === 'production';
    const domain = this.configService.get<string>('COOKIE_DOMAIN')?.trim();
    const secure =
      this.configService.get<string>('COOKIE_SECURE') === 'true' ||
      (isProduction && this.configService.get<string>('COOKIE_SECURE') !== 'false');

    return {
      httpOnly: true,
      secure,
      sameSite: secure ? ('none' as const) : ('lax' as const),
      path: '/',
      ...(domain ? { domain } : {}),
      maxAge: this.refreshMaxAgeMs(),
    };
  }

  private refreshMaxAgeMs(): number {
    const raw = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN_SECONDS');
    const seconds = Number(raw);
    const ttl = Number.isFinite(seconds) && seconds > 0 ? seconds : 604800;
    return ttl * 1000;
  }
}
