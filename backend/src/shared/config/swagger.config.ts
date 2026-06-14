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
          '### Como testar (passo a passo)',
          '1. Em **POST /auth/login**, clique em **Try it out** — o corpo já vem',
          '   preenchido com o usuário seed (`aivacol` / `aivacol123!`).',
          '2. Copie o `accessToken`, clique em **Authorize** (cadeado) e cole o token.',
          '3. Crie uma **marca** em `POST /brands` (ex.: `{ "name": "Aivacol" }`).',
          '4. Crie um **modelo** em `POST /models` usando o `id` da marca em `brandId`.',
          '5. Crie um **veículo** em `POST /vehicles` usando o `id` do modelo em `modelId`.',
          '6. Consulte, edite e remova nos demais endpoints — todos trazem exemplos prontos.',
          '',
          'O tema acompanha automaticamente o modo claro/escuro do seu sistema.',
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
          '### How to test (step by step)',
          '1. On **POST /auth/login**, click **Try it out** — the body is',
          '   pre-filled with the seeded user (`aivacol` / `aivacol123!`).',
          '2. Copy the `accessToken`, click **Authorize** (lock icon) and paste it.',
          '3. Create a **brand** at `POST /brands` (e.g. `{ "name": "Aivacol" }`).',
          '4. Create a **model** at `POST /models` using the brand `id` as `brandId`.',
          '5. Create a **vehicle** at `POST /vehicles` using the model `id` as `modelId`.',
          '6. Query, edit and delete on the other endpoints — all ship ready-to-run examples.',
          '',
          'The theme follows your system light/dark preference automatically.',
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
