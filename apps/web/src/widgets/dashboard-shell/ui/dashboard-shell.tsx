'use client';

import {
  BookOpenIcon,
  ChartLineUpIcon,
  ListHeartIcon,
  RobotIcon,
  SignOutIcon,
  SquaresFourIcon,
  UserCircleIcon,
} from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';

import { DashboardContentFooter } from './dashboard-content-footer';

import { logout } from '@/features/auth/api/auth-api';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { BrandLink } from '@/shared/ui/brand-link';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/shared/ui/sidebar';

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();

  const links = [
    { href: '/market' as const, label: t('market'), icon: ChartLineUpIcon },
    { href: '/watchlist' as const, label: t('watchlist'), icon: ListHeartIcon },
    { href: '/diary' as const, label: t('diary'), icon: BookOpenIcon, disabled: true },
    { href: '/portfolio' as const, label: t('portfolio'), icon: SquaresFourIcon, disabled: true },
    { href: '/ai' as const, label: t('ai'), icon: RobotIcon, disabled: true },
  ];

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <SidebarProvider>
      <div className="bg-background text-foreground flex min-h-screen w-full">
        <Sidebar collapsible="icon" className="border-border">
          <SidebarHeader className="border-border border-b px-2 py-3 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-1">
            <BrandLink
              href="/market"
              label={t('brand')}
              showLabel="sidebar"
              className="group-data-[collapsible=icon]:justify-center"
            />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {links.map(({ href, label, icon: Icon, disabled }) => {
                    const active = pathname === href || pathname.startsWith(`${href}/`);
                    return (
                      <SidebarMenuItem key={href}>
                        {disabled ? (
                          <SidebarMenuButton disabled tooltip={label}>
                            <Icon className="size-5" aria-hidden />
                            <span>{label}</span>
                          </SidebarMenuButton>
                        ) : (
                          <SidebarMenuButton asChild isActive={active}>
                            <Link href={href}>
                              <Icon
                                className="size-5"
                                weight={active ? 'bold' : 'regular'}
                                aria-hidden
                              />
                              <span>{label}</span>
                            </Link>
                          </SidebarMenuButton>
                        )}
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-border border-t p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/profile' || pathname.startsWith('/profile/')}
                  tooltip={t('profile')}
                >
                  <Link href="/profile">
                    <UserCircleIcon className="size-5" aria-hidden />
                    <span>{t('profile')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={t('logout')}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={handleLogout}
                >
                  <SignOutIcon className="size-5" aria-hidden />
                  <span>{t('logout')}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="border-border flex h-14 items-center gap-2 border-b px-4 md:hidden">
            <SidebarTrigger />
            <BrandLink href="/market" label={t('brand')} showLabel={false} logoClassName="size-8" />
          </div>
          <main className="flex min-h-0 flex-1 flex-col px-4 py-6 pb-28 md:px-8 md:pb-8">
            <div className="flex min-h-0 flex-1 flex-col">{children}</div>
            <DashboardContentFooter />
          </main>
          {isMobile ? (
            <nav className="border-border bg-card/90 fixed inset-x-0 bottom-0 z-40 flex justify-around border-t px-2 py-2 backdrop-blur">
              {links
                .filter((l) => !l.disabled)
                .map(({ href, label, icon: Icon }) => {
                  const active = pathname === href || pathname.startsWith(`${href}/`);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        'flex flex-col items-center gap-0.5 px-2 py-1 text-xs',
                        active ? 'text-primary' : 'text-muted-foreground',
                      )}
                    >
                      <Icon className="size-5" weight={active ? 'bold' : 'regular'} aria-hidden />
                      <span>{label}</span>
                    </Link>
                  );
                })}
            </nav>
          ) : null}
        </div>
      </div>
    </SidebarProvider>
  );
}
