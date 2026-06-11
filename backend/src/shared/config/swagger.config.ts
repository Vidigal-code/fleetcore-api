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
        description: [
          'Documentação oficial das APIs de Gestão de Frota.',
          '',
          '### Como testar / How to test',
          '1. Em **POST /auth/login**, clique em **Try it out** — o corpo já vem',
          '   preenchido com o usuário seed (`aivacol` / `aivacol123!`).',
          '2. Copie o `accessToken` da resposta.',
          '3. Clique em **Authorize** (cadeado) e cole o token.',
          '4. Todas as rotas protegidas já trazem exemplos prontos para executar.',
        ].join('\n'),
        version: '1.0.0',
        path: 'docs-pt',
        locale: 'pt-BR',
        contactName: 'Equipe Fleetcore',
        contactEmail: 'contato@fleetcore.local',
      },
      {
        title: 'Fleetcore API',
        description: [
          'Official Fleet Management API documentation.',
          '',
          '### How to test',
          '1. On **POST /auth/login**, click **Try it out** — the body is',
          '   pre-filled with the seeded user (`aivacol` / `aivacol123!`).',
          '2. Copy the `accessToken` from the response.',
          '3. Click **Authorize** (lock icon) and paste the token.',
          '4. Every protected route ships ready-to-run example payloads.',
        ].join('\n'),
        version: '1.0.0',
        path: 'docs',
        locale: 'en-US',
        contactName: 'Fleetcore Team',
        contactEmail: 'contact@fleetcore.local',
      },
    ],
  }),
);
