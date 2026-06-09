'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { LogOut, Menu, X } from 'lucide-react';

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

export interface MainHeaderProps {
  mobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
}

export const MainHeader = ({ mobileMenuOpen, onMobileMenuToggle }: MainHeaderProps) => {
  const pathname = usePathname();
  const user = useAppSelector(selectCurrentUser);
  const logout = useLogout();

  const currentRoles = user?.roles ?? [];

  const isActive = useMemo(() => {
    return (href: string) => {
      const [path] = href.split('#');
      if (!path) return false;
      return path === pathname;
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Fechar navegação' : 'Abrir navegação'}
            onClick={onMobileMenuToggle}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-surface/70 text-foreground shadow-sm transition hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {appConfig.appName}
            </span>
            <span className="text-lg font-semibold leading-tight text-foreground">
              Centro de Comando de Frotas
            </span>
          </div>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {primaryNavigation.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={cn(
                'relative text-sm font-semibold uppercase tracking-[0.12em] transition-colors duration-200 ease-subtle',
                isActive(link.href)
                  ? 'text-accent after:absolute after:-bottom-2 after:left-0 after:h-1 after:w-full after:rounded-full after:bg-accent'
                  : 'text-muted hover:text-accent',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-8 lg:flex">
            {supportNavigation.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
                className="text-xs font-semibold uppercase tracking-[0.18em] text-muted transition hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <ThemeToggle />

          <div className="hidden flex-col items-end lg:flex">
            <span className="text-sm font-semibold text-foreground">
              {user?.name ?? 'Usuário'}
            </span>
            <span className="text-xs text-muted">{user?.email ?? '---'}</span>
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
            className="hidden border border-border/60 bg-surface/70 px-3 py-1.5 text-sm font-semibold uppercase tracking-[0.18em] text-muted hover:border-accent/60 hover:text-accent lg:inline-flex"
          >
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};
