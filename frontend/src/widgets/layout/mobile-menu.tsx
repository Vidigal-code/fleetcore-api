'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, LogOut, X } from 'lucide-react';

import { ThemeToggle } from '@/features/theme/toggle';
import { getNavigationConfig } from '@/entities/navigation/model/navigation';
import { useAppSelector } from '@/processes/app/store/hooks';
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from '@/processes/auth/model/auth-selectors';
import { useLogout } from '@/processes/auth/model/use-logout';
import { appConfig } from '@/shared/config/env';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import {
  createPathMatcher,
  getAriaCurrent,
  getBrandMonogram,
  getLinkAttributes,
  getNavLinkClassName,
} from '@/widgets/layout/navigation-helpers';
import { RoleBadges } from '@/widgets/layout/role-badges';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOBILE_PANEL_CLASS =
  'fixed inset-0 z-50 flex h-full flex-col bg-background/92 backdrop-blur-xl lg:hidden';

const MobileMenuHeader = ({
  appName,
  monogram,
  onClose,
}: {
  appName: string;
  monogram: string;
  onClose: () => void;
}) => (
  <div className="flex items-center justify-between border-b border-border/50 px-6 py-5">
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/15 text-accent shadow-inner shadow-accent/15">
        <span className="text-sm font-black tracking-[0.28em]">{monogram}</span>
      </span>
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold text-foreground">{appName}</span>
        <span className="text-[0.62rem] uppercase tracking-[0.26em] text-muted opacity-80">
          Menu principal
        </span>
      </div>
    </div>
    <button
      type="button"
      onClick={onClose}
      aria-label="Fechar menu"
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-surface/70 text-foreground shadow-sm transition hover:border-accent/60 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2"
    >
      <X className="h-5 w-5" />
    </button>
  </div>
);

const MobileProfileSummary = ({
  name,
  email,
}: {
  name: string;
  email: string;
}) => (
  <div className="flex flex-col items-center gap-1 rounded-2xl border border-border/50 bg-surface/70 px-6 py-4 text-center">
    <span className="text-sm font-semibold text-foreground">{name}</span>
    <span className="text-xs uppercase tracking-[0.24em] text-muted">{email}</span>
  </div>
);

const MobileGuestSummary = () => (
  <div className="flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-surface/70 px-6 py-6 text-center">
    <span className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">
      Vamos otimizar sua frota?
    </span>
    <p className="text-xs text-muted">
      Entre ou crie uma conta para acessar o painel inteligente de veículos, modelos e marcas em tempo real.
    </p>
  </div>
);

const MobilePrimaryNavigation = ({
  isActive,
  onNavigate,
  links,
}: {
  isActive: (href: string) => boolean;
  onNavigate: () => void;
  links: ReturnType<typeof getNavigationConfig>['primary'];
}) => (
  <nav className="flex flex-col gap-3">
    {links.map((link) => {
      const active = isActive(link.href);
      const { href, target, rel } = getLinkAttributes(link);
      return (
        <Link
          key={link.id}
          href={href}
          target={target}
          rel={rel}
          aria-current={getAriaCurrent(active)}
          onClick={onNavigate}
          className={cn(
            getNavLinkClassName({ active, variant: 'primary' }),
            'w-full justify-between rounded-2xl border border-border/60 bg-surface/80 px-4 py-3 text-sm tracking-[0.2em] text-foreground shadow-sm',
          )}
        >
          <span>{link.label}</span>
          <ChevronRight className="h-4 w-4 text-muted" />
        </Link>
      );
    })}
  </nav>
);

const MobileSupportNavigation = ({
  onNavigate,
  isActive,
  links,
}: {
  onNavigate: () => void;
  isActive: (href: string) => boolean;
  links: ReturnType<typeof getNavigationConfig>['support'];
}) => (
  <nav className="flex flex-col gap-2">
    {links.map((link) => {
      const active = isActive(link.href);
      const { href, target, rel } = getLinkAttributes(link);
      return (
        <Link
          key={link.id}
          href={href}
          target={target}
          rel={rel}
          aria-current={getAriaCurrent(active)}
          onClick={onNavigate}
          className={cn(
            getNavLinkClassName({ active, variant: 'support' }),
            'w-full justify-start rounded-full border border-transparent px-3 py-1.5 text-[0.7rem] text-muted opacity-80 hover:border-accent/40',
          )}
        >
          {link.label}
        </Link>
      );
    })}
  </nav>
);

const MobileSpotlightNavigation = ({
  onNavigate,
  links,
  cta,
}: {
  onNavigate: () => void;
  links: ReturnType<typeof getNavigationConfig>['spotlight'];
  cta?: ReturnType<typeof getNavigationConfig>['cta'];
}) => {
  if (links.length === 0 && !cta) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      {links.map((link) => {
        const { href, target, rel } = getLinkAttributes(link);
        return (
          <Link
            key={link.id}
            href={href}
            target={target}
            rel={rel}
            onClick={onNavigate}
            className="flex w-full items-center justify-between rounded-full border border-border/60 bg-surface/80 px-4 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-muted transition hover:border-accent/50 hover:text-accent"
          >
            {link.label}
            <ChevronRight className="h-4 w-4 text-muted" />
          </Link>
        );
      })}
      {cta ? (
        <Link
          key={cta.id}
          href={cta.href}
          onClick={onNavigate}
          className="flex w-full items-center justify-center rounded-full border border-accent/40 bg-accent px-4 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-background shadow-[0_10px_30px_rgba(229,166,19,0.35)] transition hover:-translate-y-0.5 hover:bg-accent-strong"
        >
          {cta.label}
        </Link>
      ) : null}
    </div>
  );
};

const MobileMenuFooter = ({
  onLogout,
  onClose,
}: {
  onLogout: () => Promise<void>;
  onClose: () => void;
}) => (
  <div className="mt-auto flex flex-col gap-4">
    <div className="flex justify-center">
      <ThemeToggle />
    </div>
    <Button
      type="button"
      onClick={() => {
        void (async () => {
          try {
            await onLogout();
          } catch (error) {
            console.error('Erro ao encerrar sessão', error);
          } finally {
            onClose();
          }
        })();
      }}
      variant="ghost"
      icon={<LogOut className="h-5 w-5" />}
      className="w-full justify-center rounded-2xl border border-border/60 bg-surface/80 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted transition hover:border-accent/50 hover:text-accent"
    >
      Sair da conta
    </Button>
  </div>
);

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const pathname = usePathname();
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const logout = useLogout();

  if (!isOpen) {
    return null;
  }

  const isActive = createPathMatcher(pathname);
  const navigation = getNavigationConfig(!!isAuthenticated);
  const monogram = getBrandMonogram(appConfig.appName);
  const roles = user?.roles ?? [];

  const handleNavigate = () => {
    onClose();
  };

  return (
    <div className={MOBILE_PANEL_CLASS}>
      <MobileMenuHeader appName={appConfig.appName} monogram={monogram} onClose={onClose} />
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-8">
        {isAuthenticated && user ? (
          <MobileProfileSummary name={user.name} email={user.email} />
        ) : (
          <MobileGuestSummary />
        )}
        <MobilePrimaryNavigation
          isActive={isActive}
          onNavigate={handleNavigate}
          links={navigation.primary}
        />
        <MobileSupportNavigation
          isActive={isActive}
          onNavigate={handleNavigate}
          links={navigation.support}
        />
        {!isAuthenticated ? (
          <MobileSpotlightNavigation
            onNavigate={handleNavigate}
            links={navigation.spotlight}
            cta={navigation.cta}
          />
        ) : null}
        {isAuthenticated ? <RoleBadges roles={roles} className="justify-center" /> : null}
        {isAuthenticated ? (
          <MobileMenuFooter
            onLogout={async () => {
              await logout();
            }}
            onClose={onClose}
          />
        ) : null}
      </div>
    </div>
  );
};
