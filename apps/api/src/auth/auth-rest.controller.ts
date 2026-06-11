import { Controller, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { AuthCookieService } from './lib/auth-cookie.service';
import { JwtAuthGuard, RestCurrentUser } from './guards/jwt-auth.guard';

import type { AuthenticatedUser } from './auth.service';
import type { Request, Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthRestController {
  constructor(
    private readonly authService: AuthService,
    private readonly authCookieService: AuthCookieService,
  ) {}

  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @ApiOperation({ summary: 'Rotate refresh cookie and issue a new access token' })
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = this.authCookieService.getRefreshTokenFromRequest(req);
    const session = await this.authService.refreshWithOpaqueToken(refreshToken);
    this.authCookieService.setRefreshCookie(res, session.refreshToken);
    return { accessToken: session.accessToken };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke refresh session and clear cookie' })
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @Post('logout')
  @HttpCode(200)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @RestCurrentUser() user: AuthenticatedUser,
  ) {
    const refreshToken = this.authCookieService.getRefreshTokenFromRequest(req);
    await this.authService.revokeOpaqueRefreshToken(refreshToken, user.userId);
    this.authCookieService.clearRefreshCookie(res);
    return { ok: true };
  }
}
