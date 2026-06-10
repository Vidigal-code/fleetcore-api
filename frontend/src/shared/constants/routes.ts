export const ROUTES = {
  landing: '/',
  login: '/login',
  register: '/register',
  recoverPassword: '/recover',
  dashboard: '/dashboard',
  vehicles: '/vehicles',
  models: '/models',
  brands: '/brands',
  profile: '/profile',
  settings: '/settings',
  documentation: 'https://vidigal-code.github.io/fleetcore-api/docs/',
  status: 'https://github.com/Vidigal-code/fleetcore-api',
  privacy: '/politica-de-privacidade',
  terms: '/termos',
} as const;

export type RouteKey = keyof typeof ROUTES;
