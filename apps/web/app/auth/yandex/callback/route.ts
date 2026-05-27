import { handleOAuthCallback } from '@/features/auth/lib/handle-oauth-callback';

export function GET(request: Request) {
  return handleOAuthCallback(request, 'yandex');
}
