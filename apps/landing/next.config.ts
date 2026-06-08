import createNextIntlPlugin from 'next-intl/plugin';

import type { NextConfig } from 'next';

const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || 'http://localhost:3001';

const nextConfig: NextConfig = {
  allowedDevOrigins: [appUrl],
  transpilePackages: ['@repo/ui', '@repo/shared'],
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(nextConfig);
