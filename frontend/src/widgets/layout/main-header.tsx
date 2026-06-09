'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { ChevronRight, LogOut, Menu, X } from 'lucide-react';

import { ThemeToggle } from '@/features/theme/toggle';
import {
  primaryNavigation,
  supportNavigation,
} from '@/entities/navigation/model/navigation';
import { useAppSelector } from '@/processes/app/store/hooks';
import { selectCurrentUser } from '@/processes/auth/model/auth-selectors';
import { useLogout } from '@/processes/auth/model/use-logout';
import { appConfig } from '@/shared/config/env';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Surface } from '@/shared/ui/layout-primitives';

export interface MainHeaderProps {
  mobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
}

export const MainHeader = ({ mobileMenuOpen, onMobileMenuToggle }: MainHeaderProps) => {
  const pathname = usePathname();
  const user = useAppSelector(selectCurrentUser);
  const logout = useLogout();

  const currentRoles = user?.roles ?? [];
  const brandMark = appConfig.appName.slice(0, 2).toUpperCase();

  const isActive = useMemo(() => {
    return (href: string) => {
      const [path] = href.split('#');
      if (!path) return false;
      return path === pathname;
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <Surface
          tone="base"
          elevation="floating"
          padding="sm"
          radius="xl"
          glass="base"
          className="mx-0 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex flex-1 items-center gap-3 lg:gap-4">
            <button
              type="button"
              aria-label={mobileMenuOpen ? 'Fechar navegação' : 'Abrir navegação'}
              onClick={onMobileMenuToggle}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-surface/80 text-foreground shadow-sm transition hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent shadow-inner shadow-accent/15 sm:flex">
              <span className="text-sm font-black tracking-[0.24em]">{brandMark}</span>
            </div>

            <div className="flex flex-1 flex-col text-left">
              <span className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-muted">
                {appConfig.appName}
              </span>
              <span className="text-base font-semibold text-foreground sm:text-lg">
                Plataforma Inteligente de Frotas
              </span>
            </div>
          </div>

          <nav className="hidden min-w-0 flex-1 flex-wrap items-center justify-center gap-2 lg:flex">
            {primaryNavigation.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={cn(
                  'group relative overflow-hidden rounded-full px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] transition-all duration-base ease-subtle',
                  isActive(link.href)
                    ? 'bg-accent text-background shadow-[0_16px_42px_rgba(240,174,0,0.32)]'
                    : 'nav-pill text-muted hover:text-foreground hover:shadow-[0_16px_42px_rgba(240,174,0,0.18)]',
                )}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {link.label}
                  {isActive(link.href) ? (
                    <ChevronRight className="h-3 w-3" />
                  ) : (
                    <span className="h-1 w-1 rounded-full bg-accent/40 transition-all group-hover:w-2" />
                  )}
                </span>
                {!isActive(link.href) ? (
                  <span className="pointer-events-none absolute inset-0 rounded-full border border-transparent transition group-hover:border-accent/60" />
                ) : null}
              </Link>
            ))}
          </nav>

          <div className="flex flex-1 items-center justify-end gap-3 lg:gap-4">
            <div className="hidden items-center gap-3 xl:gap-5 lg:flex">
              {supportNavigation.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noreferrer' : undefined}
                  className="rounded-full border border-transparent px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.26em] text-muted transition hover:border-accent/40 hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <ThemeToggle />

            <div className="hidden min-w-[160px] flex-col items-end text-right lg:flex">
              <span className="text-sm font-semibold text-foreground">
                {user?.name ?? 'Usuário'}
              </span>
              <span className="text-[0.65rem] uppercase tracking-[0.24em] text-muted">
                {user?.email ?? '---'}
              </span>
            </div>

            {currentRoles.length > 0 ? (
              <div className="hidden items-center gap-2 lg:flex">
                {currentRoles.map((role) => (
                  <Badge key={role} variant="accent" size="xs">
                    {role}
                  </Badge>
                ))}
              </div>
            ) : null}

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                void logout();
              }}
              icon={<LogOut className="h-4 w-4" />}
              className="hidden border border-border/60 bg-surface/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted hover:border-accent/50 hover:text-accent lg:inline-flex"
            >
              Sair
            </Button>
          </div>
        </Surface>
      </div>
    </header>
  );
};
