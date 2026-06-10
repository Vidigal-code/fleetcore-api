'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import type { NavigationGroup } from '@/entities/navigation/model/navigation';
import { getFooterGroups, getNavigationConfig } from '@/entities/navigation/model/navigation';
import { useAppSelector } from '@/processes/app/store/hooks';
import { selectIsAuthenticated } from '@/processes/auth/model/auth-selectors';
import { appConfig } from '@/shared/config/env';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/utils';
import {
  createPathMatcher,
  getAriaCurrent,
  getBrandMonogram,
  getLinkAttributes,
} from '@/widgets/layout/navigation-helpers';

const FOOTER_HERO_HEADING = 'Operação inteligente para frotas';
const FOOTER_HERO_BODY =
  'Auditoria contínua, mensageria resiliente e dashboards em tempo real para decisões rápidas e confiáveis.';
const FOOTER_CTA_LABEL_AUTH = 'Ir para o painel';
const FOOTER_CTA_LABEL_GUEST = 'Começar agora';

const footerLinkClass = (active: boolean) =>
  cn(
    'group relative inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-accent',
    active ? 'text-foreground' : 'text-muted',
    'after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-accent after:opacity-0 after:transition-all after:duration-200 group-hover:after:w-full group-hover:after:opacity-100',
    active ? 'after:w-full after:opacity-100' : '',
  );

const FooterBrand = ({
  monogram,
  ctaHref,
  ctaLabel,
}: {
  monogram: string;
  ctaHref: string;
  ctaLabel: string;
}) => (
  <div className="flex flex-col gap-6">
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/15 text-accent shadow-inner shadow-accent/15">
        <span className="text-sm font-black tracking-[0.28em]">{monogram}</span>
      </span>
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">
          {appConfig.appName}
        </span>
        <span className="text-xl font-semibold text-foreground">{FOOTER_HERO_HEADING}</span>
      </div>
    </div>
    <p className="max-w-md text-sm text-muted">{FOOTER_HERO_BODY}</p>
    <Link
      href={ctaHref}
      className="inline-flex w-fit items-center justify-center rounded-full border border-accent/50 bg-accent px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-background shadow-[0_12px_32px_rgba(229,166,19,0.35)] transition hover:-translate-y-0.5 hover:bg-accent-strong"
    >
      {ctaLabel}
    </Link>
  </div>
);

const FooterGroupColumn = ({
  label,
  links,
  isActive,
}: {
  label: string;
  links: NavigationGroup['links'];
  isActive: (href: string) => boolean;
}) => (
  <div className="space-y-3">
    <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted">{label}</h3>
    <ul className="space-y-2.5">
      {links.map((link) => {
        const active = isActive(link.href);
        const { href, target, rel } = getLinkAttributes(link);
        return (
          <li key={link.id}>
            <Link
              href={href}
              target={target}
              rel={rel}
              aria-current={getAriaCurrent(active)}
              className={footerLinkClass(active)}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  </div>
);

const FooterNavigation = ({
  isActive,
  groups,
}: {
  isActive: (href: string) => boolean;
  groups: NavigationGroup[];
}) => (
  <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
    {groups.map((group) => (
      <FooterGroupColumn key={group.id} label={group.label} links={group.links} isActive={isActive} />
    ))}
  </div>
);

const FooterBottomBar = ({
  year,
}: {
  year: number;
}) => (
  <div className="border-t border-border/40 bg-background/70">
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-center text-xs uppercase tracking-[0.24em] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 xl:px-12">
      <span>
        © {year} {appConfig.appName}. Todos os direitos reservados.
      </span>
      <span className="text-[0.65rem]">
        Infraestrutura em Node.js · NestJS · Next.js · React Query · Redux Toolkit
      </span>
    </div>
  </div>
);

export const MainFooter = () => {
  const pathname = usePathname();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const isActive = useMemo(() => createPathMatcher(pathname), [pathname]);
  const navigation = useMemo(() => getNavigationConfig(isAuthenticated), [isAuthenticated]);
  const groups = useMemo(() => getFooterGroups(isAuthenticated), [isAuthenticated]);

  const monogram = getBrandMonogram(appConfig.appName);
  const currentYear = new Date().getFullYear();
  const ctaHref = isAuthenticated ? ROUTES.dashboard : navigation.cta?.href ?? ROUTES.register;
  const ctaLabel = isAuthenticated ? FOOTER_CTA_LABEL_AUTH : navigation.cta?.label ?? FOOTER_CTA_LABEL_GUEST;

  return (
    <footer className="border-t border-border/60 bg-surface/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-12 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8 xl:px-12">
        <FooterBrand monogram={monogram} ctaHref={ctaHref} ctaLabel={ctaLabel} />
        <FooterNavigation isActive={isActive} groups={groups} />
      </div>
      <FooterBottomBar year={currentYear} />
    </footer>
  );
};
