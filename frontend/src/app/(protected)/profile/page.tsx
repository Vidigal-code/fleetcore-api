import type { Metadata } from 'next';

import { UpdatePasswordForm } from '@/features/profile/update-password/ui/update-password-form';
import { UpdateProfileForm } from '@/features/profile/update-profile/ui/update-profile-form';
import { appConfig } from '@/shared/config/env';
import { PageSection, Surface, Stack } from '@/shared/ui/layout-primitives';

export const metadata: Metadata = {
  title: `${appConfig.appName} · Perfil`,
};

export default function ProfilePage() {
  return (
    <PageSection width="xl" layout="stack" className="gap-12">
      <Surface tone="base" elevation="floating" padding="lg" radius="xl" className="space-y-4">
        <Stack gap="sm">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
            Segurança e identidade
          </span>
          <h1 className="text-3xl font-semibold text-foreground">Configurações de perfil</h1>
          <p className="max-w-3xl text-sm text-muted">
            Atualize seus dados de exibição e redefina a senha com validação forte. Após alterar a senha,
            o acesso atual será finalizado automaticamente.
          </p>
        </Stack>
      </Surface>

      <div className="grid gap-8 lg:grid-cols-2">
        <Surface tone="base" elevation="low" padding="lg" radius="xl" className="space-y-4">
          <Stack gap="sm">
            <h2 className="text-lg font-semibold text-foreground">Dados do perfil</h2>
            <p className="text-sm text-muted">
              Personalize como outras equipes identificam você em relatórios e notificações.
            </p>
          </Stack>
          <UpdateProfileForm />
        </Surface>

        <Surface tone="base" elevation="low" padding="lg" radius="xl" className="space-y-4">
          <Stack gap="sm">
            <h2 className="text-lg font-semibold text-foreground">Atualizar senha</h2>
            <p className="text-sm text-muted">
              Utilize uma senha única e complexa. Após a troca, será necessário fazer login novamente.
            </p>
          </Stack>
          <UpdatePasswordForm />
        </Surface>
      </div>
    </PageSection>
  );
}
