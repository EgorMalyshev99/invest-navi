import { ConfigService } from '@nestjs/config';

export interface JwtSecrets {
  accessSecret: string;
  refreshSecret: string;
}

export function resolveJwtExpiresInSeconds(
  configService: ConfigService,
  key: 'JWT_EXPIRES_IN_SECONDS' | 'JWT_REFRESH_EXPIRES_IN_SECONDS',
  fallback: number,
): number {
  const raw = configService.get<string>(key);
  const parsed = Number(raw);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function resolveJwtSecrets(configService: ConfigService): JwtSecrets {
  const isProduction = process.env.NODE_ENV === 'production';
  const accessSecret = configService.get<string>('JWT_SECRET');
  const refreshSecret = configService.get<string>('JWT_REFRESH_SECRET');

  if (isProduction) {
    if (!accessSecret || !refreshSecret) {
      throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be set when NODE_ENV=production');
    }
    return { accessSecret, refreshSecret };
  }

  return {
    accessSecret: accessSecret ?? 'dev-access-secret',
    refreshSecret: refreshSecret ?? 'dev-refresh-secret',
  };
}

export function assertProductionEnv(): void {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  const required = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'DATABASE_URL'] as const;
  const missing = required.filter((key) => !process.env[key]?.trim());

  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
}
