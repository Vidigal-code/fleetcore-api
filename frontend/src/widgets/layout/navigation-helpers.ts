import type { NavigationLink } from '@/entities/navigation/model/navigation';
import { cn } from '@/shared/lib/utils';

export type NavVariant = 'primary' | 'support';
export type NavSize = 'compact' | 'regular';

interface NavClassOptions {
  active: boolean;
  variant: NavVariant;
  size?: NavSize;
}

const NAV_BASE_CLASS =
  'group relative inline-flex items-center justify-center rounded-full font-semibold uppercase tracking-[0.22em] transition-colors duration-200';

const NAV_SIZE_CLASS_MAP: Record<NavSize, string> = {
  compact: 'px-3 py-1.5 text-[0.68rem]',
  regular: 'px-4 py-2 text-[0.72rem] md:text-xs',
};

const NAV_VARIANT_CLASS_MAP: Record<NavVariant, string> = {
  primary: 'text-muted hover:text-foreground',
  support: 'text-muted hover:text-accent',
};

export const getNavLinkClassName = ({
  active,
  variant,
  size = 'regular',
}: NavClassOptions) => {
  const underlineBase =
    'after:absolute after:bottom-1 after:left-1/2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-accent after:opacity-0 after:transition-all after:duration-200';

  const underlineActive = active
    ? 'text-foreground after:w-full after:opacity-100'
    : 'hover:after:w-full hover:after:opacity-90 group-hover:after:w-full group-hover:after:opacity-90';

  return cn(
    NAV_BASE_CLASS,
    NAV_SIZE_CLASS_MAP[size],
    NAV_VARIANT_CLASS_MAP[variant],
    underlineBase,
    underlineActive,
  );
};

export const createPathMatcher = (pathname: string) => {
  const trimmed = pathname.replace(/\/+$/, '') || '/';

  return (href: string) => {
    const [path] = href.split('#');
    if (!path) {
      return false;
    }
    const normalized = path.replace(/\/+$/, '') || '/';
    return normalized === trimmed;
  };
};

export const getLinkAttributes = (link: NavigationLink) => {
  const target = link.external ? '_blank' : undefined;
  const rel = link.external ? 'noreferrer' : undefined;

  return {
    href: link.href,
    target,
    rel,
  } as const;
};

export const getBrandHref = (links: NavigationLink[], fallback = '/') => {
  if (links.length === 0) {
    return fallback;
  }
  return links[0]?.href ?? fallback;
};

export const getBrandMonogram = (value: string, length = 2) => {
  if (!value) {
    return ''.padEnd(length, 'X');
  }
  return value
    .trim()
    .slice(0, length)
    .toUpperCase()
    .padEnd(length, 'X');
};

export const getAriaCurrent = (active: boolean) => (active ? 'page' : undefined);
