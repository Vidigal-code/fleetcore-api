import { registerAs } from '@nestjs/config';

export interface SwaggerDocumentConfig {
  title: string;
  description: string;
  version: string;
  path: string;
  locale: string;
  contactName: string;
  contactEmail: string;
}

export interface SwaggerConfig {
  readonly documents: SwaggerDocumentConfig[];
}

export default registerAs(
  'swagger',
  (): SwaggerConfig => ({
    documents: [
      {
        title: 'Fleetcore API',
        description: 'Documentação oficial das APIs de Gestão de Frota.',
        version: '1.0.0',
        path: 'docs-pt',
        locale: 'pt-BR',
        contactName: 'Equipe Fleetcore',
        contactEmail: 'contato@fleetcore.local',
      },
      {
        title: 'Fleetcore API',
        description: 'Official Fleet Management API documentation.',
        version: '1.0.0',
        path: 'docs',
        locale: 'en-US',
        contactName: 'Fleetcore Team',
        contactEmail: 'contact@fleetcore.local',
      },
    ],
  }),
);
