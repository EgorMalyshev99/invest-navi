'use client';

import { MoonIcon, SunIcon } from '@phosphor-icons/react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const t = useTranslations('theme');
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="size-9" aria-label={t('toggle')}>
          <span className="inline-flex size-5 dark:hidden" aria-hidden>
            <SunIcon size={20} />
          </span>
          <span className="hidden size-5 dark:inline-flex" aria-hidden>
            <MoonIcon size={20} />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>{t('light')}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>{t('dark')}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>{t('system')}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
