'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { LogOut, Menu, X } from 'lucide-react';

import { ThemeToggle } from '@/features/theme/toggle';
import { getNavigationConfig } from '@/entities/navigation/model/navigation';
import { useAppSelector } from '@/processes/app/store/hooks';
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from '@/processes/auth/model/auth-selectors';
import { useLogout } from '@/processes/auth/model/use-logout';
import { appConfig } from '@/shared/config/env';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

import {
  createPathMatcher,
  getAriaCurrent,
  getBrandHref,
  getBrandMonogram,
  getLinkAttributes,
  getNavLinkClassName,
} from '@/widgets/layout/navigation-helpers';
import { RoleBadges } from '@/widgets/layout/role-badges';

export interface MainHeaderProps {
  mobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
}

const BRAND_MARK_LENGTH = 2;
const HEADER_HEIGHT = 'h-16';
const HEADER_TAGLINE = 'Operação inteligente de frotas';

const MenuToggleButton = ({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <button
    type="button"
    aria-label={isOpen ? 'Fechar navegação' : 'Abrir navegação'}
    onClick={onToggle}
    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-surface/80 text-foreground shadow-sm transition hover:border-accent/60 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 lg:hidden"
  >
    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
  </button>
);

const HeaderBrand = ({
  href,
  monogram,
  appName,
}: {
  href: string;
  monogram: string;
  appName: string;
}) => (
  <Link
    href={href}
    aria-label={`Ir para ${appName}`}
    className="group inline-flex items-center gap-3 rounded-full border border-transparent px-2 py-1 transition hover:border-accent/40"
  >
    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/15 text-accent shadow-inner shadow-accent/15">
      <span className="text-sm font-black tracking-[0.28em]">{monogram}</span>
    </span>
    <span className="hidden flex-col leading-tight text-left sm:flex">
      <span className="text-sm font-semibold text-foreground">{appName}</span>
      <span className="text-[0.62rem] font-medium uppercase tracking-[0.28em] text-muted opacity-80">
        {HEADER_TAGLINE}
      </span>
    </span>
  </Link>
);

const PrimaryNavigation = ({
  isActive,
  links,
}: {
  isActive: (href: string) => boolean;
  links: ReturnType<typeof getNavigationConfig>['primary'];
}) => (
  <nav className="hidden flex-1 items-center justify-center lg:flex">
    <div className="flex items-center gap-1 rounded-full border border-border/60 bg-background/60 px-2 py-1 backdrop-blur">
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
            className={getNavLinkClassName({ active, variant: 'primary', size: 'compact' })}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  </nav>
);

const SupportLinks = ({
  isActive,
  links,
}: {
  isActive: (href: string) => boolean;
  links: ReturnType<typeof getNavigationConfig>['support'];
}) => (
  <nav className="hidden items-center gap-2 xl:flex">
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
          className={getNavLinkClassName({ active, variant: 'support' })}
        >
          {link.label}
        </Link>
      );
    })}
  </nav>
);

const UserSummary = ({
  name,
  email,
}: {
  name: string;
  email: string;
}) => (
  <div className="hidden min-w-[160px] flex-col items-end leading-tight text-right lg:flex">
    <span className="text-sm font-semibold text-foreground">{name}</span>
    <span className="text-[0.64rem] uppercase tracking-[0.26em] text-muted">{email}</span>
  </div>
);

const LogoutButton = ({ onLogout }: { onLogout: () => Promise<void> | void }) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    onClick={() => {
      void onLogout();
    }}
    icon={<LogOut className="h-4 w-4" />}
    className="hidden border border-border/60 bg-surface/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-muted transition hover:border-accent/50 hover:text-accent lg:inline-flex"
  >
    Sair
  </Button>
);

export const MainHeader = ({ mobileMenuOpen, onMobileMenuToggle }: MainHeaderProps) => {
  const pathname = usePathname();
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const logout = useLogout();

  const currentRoles = user?.roles ?? [];

  const isActive = useMemo(() => createPathMatcher(pathname), [pathname]);
  const navigation = useMemo(() => getNavigationConfig(!!isAuthenticated), [isAuthenticated]);
  const brandHref = isAuthenticated
    ? getBrandHref(navigation.primary, ROUTES.dashboard)
    : ROUTES.landing;
  const brandMark = getBrandMonogram(appConfig.appName, BRAND_MARK_LENGTH);

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className={cn('mx-auto flex w-full max-w-6xl items-center gap-4 px-4 sm:px-6 lg:px-8 xl:px-12', HEADER_HEIGHT)}>
        <div className="flex flex-1 items-center gap-3">
          <MenuToggleButton isOpen={mobileMenuOpen} onToggle={onMobileMenuToggle} />
          <HeaderBrand href={brandHref} monogram={brandMark} appName={appConfig.appName} />
        </div>

        <PrimaryNavigation isActive={isActive} links={navigation.primary} />

        <div className="flex flex-1 items-center justify-end gap-3">
          <SupportLinks isActive={isActive} links={navigation.support} />
          <ThemeToggle />
          {isAuthenticated && user ? (
            <>
              <UserSummary name={user.name} email={user.email} />
              <RoleBadges roles={currentRoles} className="hidden lg:flex" />
              <LogoutButton
                onLogout={async () => {
                  await logout();
                }}
              />
            </>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              {navigation.spotlight.map((action) => {
                const { href, target, rel } = getLinkAttributes(action);
                return (
                  <Link
                    key={action.id}
                    href={href}
                    target={target}
                    rel={rel}
                    className={getNavLinkClassName({ active: isActive(action.href), variant: 'support', size: 'compact' })}
                  >
                    {action.label}
                  </Link>
                );
              })}
              {navigation.cta ? (
                <Link
                  key={navigation.cta.id}
                  href={navigation.cta.href}
                  className="inline-flex items-center justify-center rounded-full border border-accent/40 bg-accent px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-background shadow-[0_10px_30px_rgba(229,166,19,0.35)] transition hover:-translate-y-0.5 hover:bg-accent-strong"
                >
                  {navigation.cta.label}
                </Link>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
