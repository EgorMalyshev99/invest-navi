'use client';

import * as passwordPolicy from '@repo/api/auth/password-policy';
import { Badge } from '@repo/ui/badge';
import { cn } from '@repo/ui/lib/utils';
import { Progress } from '@repo/ui/progress';
import { Typography } from '@repo/ui/typography';

import type { PasswordRuleId, PasswordStrengthLevel } from '@repo/api/auth/password-policy';

import { useTranslations } from '@/i18n/react-i18n';

const LEVEL_INDICATOR_CLASS: Record<PasswordStrengthLevel, string> = {
  weak: '[&_[data-slot=progress-indicator]]:bg-destructive',
  fair: '[&_[data-slot=progress-indicator]]:bg-warning',
  strong: '[&_[data-slot=progress-indicator]]:bg-positive',
};

const LEVEL_TEXT_CLASS: Record<PasswordStrengthLevel, string> = {
  weak: 'text-destructive',
  fair: 'text-warning',
  strong: 'text-positive',
};

type PasswordStrengthMeterProps = {
  password: string;
  className?: string;
};

export function PasswordStrengthMeter({ password, className }: PasswordStrengthMeterProps) {
  const t = useTranslations('auth');
  const strength = passwordPolicy.analyzePassword(password);
  const progressValue = password.length > 0 ? strength.score : 0;

  return (
    <div className={cn('flex flex-col gap-3', className)} aria-live="polite">
      <div className="flex items-center justify-between gap-2">
        <Typography variant="small" className="text-muted-foreground">
          {t('passwordStrength')}
        </Typography>
        <Typography variant="small" className={cn('font-medium', LEVEL_TEXT_CLASS[strength.level])}>
          {t(`passwordStrengthLevels.${strength.level}`)}
        </Typography>
      </div>
      <Progress
        value={progressValue}
        className={cn('h-1.5', LEVEL_INDICATOR_CLASS[strength.level])}
        aria-label={t('passwordStrength')}
      />
      <div className="flex flex-wrap gap-1.5">
        {strength.rules.map((rule) => (
          <PasswordRuleBadge key={rule.id} ruleId={rule.id} met={rule.met} />
        ))}
      </div>
    </div>
  );
}

function PasswordRuleBadge({ ruleId, met }: { ruleId: PasswordRuleId; met: boolean }) {
  const t = useTranslations('auth');

  return (
    <Badge
      variant="outline"
      className={cn(
        met &&
          'border-positive/40 bg-positive/10 text-positive dark:border-positive/30 dark:bg-positive/15',
      )}
    >
      {t(`passwordRules.${ruleId}`)}
    </Badge>
  );
}
