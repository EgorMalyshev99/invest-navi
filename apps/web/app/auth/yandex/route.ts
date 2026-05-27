import { startOAuth } from '@/features/auth/lib/start-oauth';

export function GET(request: Request) {
  return startOAuth(request, 'yandex');
}
