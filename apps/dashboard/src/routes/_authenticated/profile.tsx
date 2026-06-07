import { Typography } from '@repo/ui/typography';
import { createFileRoute } from '@tanstack/react-router';


import { ProfileForm } from '@/features/profile';
import { useTranslations } from '@/i18n/react-i18n';

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  const t = useTranslations('profile');

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <Typography variant="h1">{t('pageTitle')}</Typography>
      <ProfileForm />
    </div>
  );
}
