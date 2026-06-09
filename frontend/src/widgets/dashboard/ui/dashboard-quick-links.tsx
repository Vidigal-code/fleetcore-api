'use client';

import Link from 'next/link';
import { ArrowRight, LayoutDashboard, NotebookPen, Settings2, Truck } from 'lucide-react';

import { PageSection, Surface } from '@/shared/ui/layout-primitives';

const quickLinks = [
  {
    id: 'vehicles',
    title: 'Centro de Veículos',
    description: 'Cadastre, edite e acompanhe a saúde completa da frota com filtros avançados.',
    href: '/vehicles',
    icon: <Truck className="h-5 w-5" />,
    label: 'Veículos',
  },
  {
    id: 'models',
    title: 'Catálogo de Modelos',
    description: 'Padronize atributos, vincule marcas e garanta consistência nos cadastros.',
    href: '/models',
    icon: <LayoutDashboard className="h-5 w-5" />,
    label: 'Modelos',
  },
  {
    id: 'profile',
    title: 'Configurações de Perfil',
    description: 'Atualize credenciais, senha e preferências de exibição com segurança reforçada.',
    href: '/profile',
    icon: <Settings2 className="h-5 w-5" />,
    label: 'Perfil',
  },
  {
    id: 'brands',
    title: 'Marcas Homologadas',
    description: 'Gerencie fabricantes, políticas de contratos e integrações de fornecedor.',
    href: '/brands',
    icon: <NotebookPen className="h-5 w-5" />,
    label: 'Marcas',
  },
];

export const DashboardQuickLinks = () => (
  <PageSection width="xl" layout="stack" className="gap-8">
    <div className="space-y-3 text-center lg:text-left">
      <h2 className="text-2xl font-semibold text-foreground">Comece por onde precisa</h2>
      <p className="text-sm text-muted">
        Acesse módulos especializados para conduzir cadastros, operações e governança em segundos.
      </p>
    </div>
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {quickLinks.map((link) => (
        <Surface
          key={link.id}
          tone="base"
          elevation="low"
          padding="md"
          radius="xl"
          className="flex h-full flex-col justify-between gap-4 text-center sm:text-left"
        >
          <div className="flex items-center justify-center gap-3 text-accent sm:justify-start">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/15">
              {link.icon}
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
              {link.label}
            </span>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">{link.title}</h3>
            <p className="text-sm text-muted">{link.description}</p>
          </div>
          <Link
            href={link.href}
            className="group inline-flex items-center justify-center gap-2 text-sm font-semibold text-accent transition hover:text-accent-strong sm:justify-start"
          >
            Acessar módulo
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </Surface>
      ))}
    </div>
  </PageSection>
);
