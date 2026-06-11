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

/**
 * Estilo do item de navegacao do menu mobile. O item ativo recebe uma cor de
 * marcacao (fundo + borda + texto em accent) em vez de uma linha/sublinhado,
 * melhorando a legibilidade do estado selecionado em telas pequenas.
 */
export const getMobileNavItemClassName = ({ active }: { active: boolean }) =>
  cn(
    'flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] shadow-sm transition-colors duration-base ease-subtle',
    active
      ? 'border-accent/70 bg-accent/15 text-accent'
      : 'border-border/60 bg-surface/80 text-foreground hover:border-accent/50 hover:bg-accent/10 hover:text-accent',
  );

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
