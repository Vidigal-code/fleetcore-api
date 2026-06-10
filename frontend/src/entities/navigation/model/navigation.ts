import { ROUTES } from '@/shared/constants/routes';

export interface NavigationLink {
  id: string;
  label: string;
  href: string;
  external?: boolean;
}

export interface NavigationGroup {
  id: string;
  label: string;
  links: NavigationLink[];
}

export interface NavigationConfig {
  scope: 'public' | 'private';
  primary: NavigationLink[];
  support: NavigationLink[];
  spotlight: NavigationLink[];
  cta?: NavigationLink;
}

const publicNavigation: NavigationConfig = {
  scope: 'public',
  primary: [
    { id: 'overview', label: 'Visão geral', href: '#inicio' },
    { id: 'features', label: 'Recursos', href: '#recursos' },
    { id: 'pricing', label: 'Planos', href: '#planos' },
  ],
  support: [
    { id: 'docs', label: 'Documentação', href: ROUTES.documentation, external: true },
    { id: 'status', label: 'Status', href: ROUTES.status, external: true },
  ],
  spotlight: [
    { id: 'login', label: 'Entrar', href: ROUTES.login },
    { id: 'register', label: 'Criar conta', href: ROUTES.register },
    { id: 'recover', label: 'Recuperar acesso', href: ROUTES.recoverPassword },
  ],
  cta: { id: 'primary-cta', label: 'Começar agora', href: ROUTES.register },
};

const privateNavigation: NavigationConfig = {
  scope: 'private',
  primary: [
    { id: 'dashboard', label: 'Painel', href: ROUTES.dashboard },
    { id: 'vehicles', label: 'Veículos', href: ROUTES.vehicles },
    { id: 'models', label: 'Modelos', href: ROUTES.models },
    { id: 'brands', label: 'Marcas', href: ROUTES.brands },
    { id: 'settings', label: 'Configurações', href: ROUTES.settings },
    { id: 'profile', label: 'Perfil', href: ROUTES.profile },
  ],
  support: [
    { id: 'docs', label: 'Documentação', href: ROUTES.documentation, external: true },
    { id: 'status', label: 'Status', href: ROUTES.status, external: true },
  ],
  spotlight: [],
  cta: undefined,
};

const footerBaseGroups: NavigationGroup[] = [
  {
    id: 'company',
    label: 'Companhia',
    links: [
      { id: 'about', label: 'Fleetcore', href: ROUTES.status, external: true },
      { id: 'careers', label: 'Fleetcore Docs', href: ROUTES.documentation, external: true },
    ],
  },
  {
    id: 'legal',
    label: 'Legal',
    links: [
      { id: 'privacy', label: 'Privacidade', href: ROUTES.privacy },
      { id: 'terms', label: 'Termos de Uso', href: ROUTES.terms },
    ],
  },
];

export const getNavigationConfig = (isAuthenticated: boolean): NavigationConfig =>
  isAuthenticated ? privateNavigation : publicNavigation;

export const getFooterGroups = (isAuthenticated: boolean): NavigationGroup[] => {
  const navigation = getNavigationConfig(isAuthenticated);
  return [
    {
      id: 'product',
      label: 'Produto',
      links: navigation.primary,
    },
    ...footerBaseGroups,
  ];
};
