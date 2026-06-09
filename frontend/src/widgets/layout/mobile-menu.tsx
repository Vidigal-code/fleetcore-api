'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, X } from 'lucide-react';

import { ThemeToggle } from '@/features/theme/toggle';
import {
  primaryNavigation,
  supportNavigation,
} from '@/entities/navigation/model/navigation';
import { useAppSelector } from '@/processes/app/store/hooks';
import { selectCurrentUser } from '@/processes/auth/model/auth-selectors';
import { useLogout } from '@/processes/auth/model/use-logout';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const pathname = usePathname();
  const user = useAppSelector(selectCurrentUser);
  const logout = useLogout();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-xl md:hidden">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">{user?.name ?? 'Usuário'}</span>
            <span className="text-xs text-muted">{user?.email ?? '---'}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-surface/70 text-foreground shadow-sm transition hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-8">
          <nav className="flex flex-col gap-4">
            {primaryNavigation.map((link) => {
              const [path] = link.href.split('#');
              const active = path === pathname;
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={onClose}
                  className={`rounded-2xl border border-transparent px-4 py-3 text-base font-semibold uppercase tracking-[0.18em] transition ${active ? 'bg-accent/20 text-accent-strong' : 'bg-surface/80 text-foreground hover:border-accent/40 hover:bg-accent/10 hover:text-accent'}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-wrap gap-3">
            {supportNavigation.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
                onClick={onClose}
                className="rounded-full border border-border/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted transition hover:border-accent/50 hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {user?.roles?.length ? (
            <div className="flex flex-wrap gap-2">
              {user.roles.map((role) => (
                <Badge key={role} variant="accent" size="xs">
                  {role}
                </Badge>
              ))}
            </div>
          ) : null}

          <ThemeToggle />

          <Button
            type="button"
            onClick={() => {
              logout();
              onClose();
            }}
            variant="ghost"
            icon={<LogOut className="h-5 w-5" />}
            className="w-full justify-center rounded-2xl border border-border/60 bg-surface/80 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted hover:border-accent/50 hover:text-accent"
          >
            Sair da conta
          </Button>
        </div>
      </div>
    </div>
  );
};
