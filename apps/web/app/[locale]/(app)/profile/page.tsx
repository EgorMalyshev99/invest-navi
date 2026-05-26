import { useTranslations } from 'next-intl';

import { ProfileForm } from '@/features/profile';
import { Typography } from '@/shared/ui/typography';

export default function ProfilePage() {
  const t = useTranslations('profile');

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Typography variant="h1">{t('pageTitle')}</Typography>
      <ProfileForm />
    </div>
  );
}
