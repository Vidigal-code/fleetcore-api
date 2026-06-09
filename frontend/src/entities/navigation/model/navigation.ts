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
    href: 'https://docs.aivacol.com/fleetcore',
    external: true,
  },
  { id: 'status', label: 'Status', href: 'https://status.aivacol.com', external: true },
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
      { id: 'about', label: 'Sobre a Aivacol', href: 'https://aivacol.com', external: true },
      { id: 'careers', label: 'Carreiras', href: 'https://aivacol.com/carreiras', external: true },
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
