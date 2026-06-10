'use client';

import { PageSection, Surface, Stack } from '@/shared/ui/layout-primitives';
import { Button } from '@/shared/ui/button';
import { InputField } from '@/shared/ui/input-field';
import { InlineMessage } from '@/shared/ui/inline-message';

export const SettingsScreen = () => (
  <div className="flex flex-col gap-10 pb-16">
    <PageSection width="xl" layout="stack" className="gap-8">
      <Stack gap="sm">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
          Configurações da conta
        </span>
        <h1 className="text-3xl font-semibold text-foreground">Preferências pessoais</h1>
        <p className="max-w-2xl text-sm text-muted">
          Ajuste dados cadastrais, preferências de notificação e integrações. Todas as alterações são
          gravadas no log de auditoria com data, hora e responsável.
        </p>
      </Stack>
      <Surface tone="base" elevation="floating" padding="lg" radius="xl" className="space-y-6">
        <Stack gap="xs">
          <h2 className="text-xl font-semibold text-foreground">Informações básicas</h2>
          <p className="text-sm text-muted">
            Estes dados ficam visíveis para os operadores com acesso ao painel de auditoria.
          </p>
        </Stack>
        <div className="grid gap-4 md:grid-cols-2">
          <InputField label="Nome completo" placeholder="Aivacol Admin" defaultValue="Aivacol Admin" />
          <InputField label="E-mail corporativo" placeholder="admin@fleetcore.com" defaultValue="admin@fleetcore.com" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <InputField label="Fuso horário" placeholder="America/Sao_Paulo" defaultValue="America/Sao_Paulo" />
          <InputField label="Idioma" placeholder="Português (Brasil)" defaultValue="Português (Brasil)" />
        </div>
        <div className="flex justify-end">
          <Button type="button" className="w-full sm:w-auto">
            Salvar preferências
          </Button>
        </div>
      </Surface>
      <Surface tone="contrast" elevation="low" padding="lg" radius="xl" className="space-y-6">
        <Stack gap="xs">
          <h2 className="text-xl font-semibold text-foreground">Segurança e sessões</h2>
          <p className="text-sm text-muted">
            Revogue sessões ativas, atualize chave de API e ajuste políticas de autenticação multifator.
          </p>
        </Stack>
        <InlineMessage variant="warning" className="text-sm">
          Fluxo em modo demonstrativo. Integração com provedores de MFA deve ser configurada via painel de
          segurança.
        </InlineMessage>
        <div className="grid gap-3 md:grid-cols-2">
          <Button type="button" variant="secondary" className="justify-center">
            Revogar sessões
          </Button>
          <Button type="button" variant="ghost" className="justify-center border-accent/50 text-accent">
            Gerar nova chave de API
          </Button>
        </div>
      </Surface>
    </PageSection>
  </div>
);
