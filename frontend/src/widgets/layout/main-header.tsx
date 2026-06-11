'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { LogOut, Menu, User, X } from 'lucide-react';

import { ThemeToggle } from '@/features/theme/toggle';
import {
  getNavigationConfig,
  getPrimaryLinks,
  type NavigationCategory,
} from '@/entities/navigation/model/navigation';
import { useAppSelector } from '@/processes/app/store/hooks';
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from '@/processes/auth/model/auth-selectors';
import { useLogout } from '@/processes/auth/model/use-logout';
import { appConfig } from '@/shared/config/env';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/utils';
import { Dropdown, type DropdownItem } from '@/shared/ui/dropdown';
import { NavSelect } from '@/shared/ui/nav-select';
import { useLinkNavigation } from '@/widgets/layout/model/use-link-navigation';

import {
  createPathMatcher,
  getBrandHref,
  getBrandMonogram,
  getLinkAttributes,
  getNavLinkClassName,
} from '@/widgets/layout/navigation-helpers';

export interface MainHeaderProps {
  mobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
}

const BRAND_MARK_LENGTH = 2;
const HEADER_TAGLINE = 'Operação inteligente de frotas';

type AccountActionId = 'profile' | 'logout';

const ACCOUNT_MENU_ITEMS: DropdownItem[] = [
  { id: 'profile', label: 'Perfil', icon: <User className="h-4 w-4" /> },
  { id: 'logout', label: 'Sair', tone: 'danger', icon: <LogOut className="h-4 w-4" /> },
];

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
    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/60 bg-surface/80 text-foreground shadow-sm transition hover:border-accent/60 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 xl:hidden"
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
    className="group inline-flex min-w-0 items-center gap-2 rounded-full border border-transparent px-2 py-1 transition hover:border-accent/40"
  >
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent shadow-inner shadow-accent/15">
      <span className="text-[0.65rem] font-black tracking-[0.2em]">{monogram}</span>
    </span>
    <span className="hidden min-w-0 flex-col leading-tight text-left sm:flex">
      <span className="truncate text-xs font-semibold text-foreground">{appName}</span>
      <span className="hidden truncate text-[0.5rem] font-medium uppercase tracking-[0.2em] text-muted opacity-80 2xl:block">
        {HEADER_TAGLINE}
      </span>
    </span>
  </Link>
);

const CategoryNavigation = ({
  categories,
  activeHref,
  onSelectLink,
  className,
}: {
  categories: NavigationCategory[];
  activeHref: string;
  onSelectLink: (link: NavigationCategory['links'][number]) => void;
  className?: string;
}) => (
  <nav className={cn('hidden items-center gap-2 xl:flex', className)}>
    {categories.map((category) => (
      <NavSelect
        key={category.id}
        label={category.label}
        links={category.links}
        activeHref={activeHref}
        onSelectLink={onSelectLink}
        className="w-36"
      />
    ))}
  </nav>
);

const GuestActions = ({
  isActive,
  spotlight,
}: {
  isActive: (href: string) => boolean;
  spotlight: ReturnType<typeof getNavigationConfig>['spotlight'];
}) => (
  <div className="hidden items-center gap-1.5 xl:flex">
    {spotlight.map((action) => {
      const { href, target, rel } = getLinkAttributes(action);
      return (
        <Link
          key={action.id}
          href={href}
          target={target}
          rel={rel}
          className={cn(
            'whitespace-nowrap',
            getNavLinkClassName({
              active: isActive(action.href),
              variant: 'support',
              size: 'compact',
            }),
          )}
        >
          {action.label}
        </Link>
      );
    })}
  </div>
);

const AccountMenu = ({
  userName,
  onAction,
  className,
}: {
  userName: string;
  onAction: (id: AccountActionId) => void;
  className?: string;
}) => (
  <Dropdown
    label={userName}
    ariaLabel={`Conta de ${userName}`}
    items={ACCOUNT_MENU_ITEMS}
    onSelect={(item) => onAction(item.id as AccountActionId)}
    align="end"
    className={cn('w-44', className)}
  />
);

export const MainHeader = ({ mobileMenuOpen, onMobileMenuToggle }: MainHeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const logout = useLogout();
  const navigateLink = useLinkNavigation();

  const isActive = useMemo(() => createPathMatcher(pathname), [pathname]);
  const navigation = useMemo(() => getNavigationConfig(!!isAuthenticated), [isAuthenticated]);
  const primaryLinks = useMemo(() => getPrimaryLinks(navigation), [navigation]);
  const brandHref = isAuthenticated
    ? getBrandHref(primaryLinks, ROUTES.dashboard)
    : ROUTES.landing;
  const brandMark = getBrandMonogram(appConfig.appName, BRAND_MARK_LENGTH);

  const handleAccountAction = (id: AccountActionId) => {
    if (id === 'profile') {
      router.push(ROUTES.profile);
      return;
    }
    void logout();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 px-4 py-2.5 sm:px-6 lg:px-8 xl:gap-6 xl:px-12">
        <div className="flex min-w-0 items-center justify-start gap-3">
          <MenuToggleButton isOpen={mobileMenuOpen} onToggle={onMobileMenuToggle} />
          <CategoryNavigation
            categories={navigation.categories}
            activeHref={pathname}
            onSelectLink={navigateLink}
          />
        </div>

        <div className="flex min-w-0 justify-center">
          <HeaderBrand href={brandHref} monogram={brandMark} appName={appConfig.appName} />
        </div>

        <div className="flex min-w-0 items-center justify-end gap-3">
          {isAuthenticated && user ? (
            <AccountMenu
              userName={user.name}
              onAction={handleAccountAction}
              className="hidden md:block"
            />
          ) : (
            <GuestActions isActive={isActive} spotlight={navigation.spotlight} />
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
