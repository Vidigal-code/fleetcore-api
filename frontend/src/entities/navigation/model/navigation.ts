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

export const primaryNavigation: NavigationLink[] = [
  { id: 'dashboard', label: 'Painel', href: '/dashboard' },
  { id: 'vehicles', label: 'Veículos', href: '/dashboard#veiculos' },
  { id: 'models', label: 'Modelos', href: '/dashboard#modelos' },
  { id: 'brands', label: 'Marcas', href: '/dashboard#marcas' },
];

export const supportNavigation: NavigationLink[] = [
  {
    id: 'docs',
    label: 'Documentação',
    href: 'https://vidigal-code.github.io/fleetcore-api/docs/',
    external: true,
  },
  { id: 'status', label: 'Status', href: 'https://github.com/Vidigal-code/fleetcore-api', external: true },
];

export const footerGroups: NavigationGroup[] = [
  {
    id: 'product',
    label: 'Produto',
    links: primaryNavigation,
  },
  {
    id: 'company',
    label: 'Companhia',
    links: [
      { id: 'about', label: 'Fleetcore', href: 'https://github.com/Vidigal-code/fleetcore-api', external: true },
      { id: 'careers', label: 'Fleetcore Docs', href: 'https://vidigal-code.github.io/fleetcore-api/docs/', external: true },
    ],
  },
  {
    id: 'legal',
    label: 'Legal',
    links: [
      { id: 'privacy', label: 'Privacidade', href: '/politica-de-privacidade' },
      { id: 'terms', label: 'Termos de Uso', href: '/termos' },
    ],
  },
];
