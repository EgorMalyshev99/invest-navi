import { useTranslations } from 'next-intl';

import { LoginForm } from '@/features/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Typography } from '@/shared/ui/typography';

export default function LoginPage() {
  const t = useTranslations('auth');

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-md items-center px-4 py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <Typography variant="h2">{t('loginTitle')}</Typography>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
