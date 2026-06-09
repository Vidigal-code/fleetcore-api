'use client';

import { useRouter } from 'next/navigation';
import { Compass, Home as HomeIcon } from 'lucide-react';

import { PageSection, Surface, Stack } from '@/shared/ui/layout-primitives';
import { Button } from '@/shared/ui/button';

export const NotFoundScreen = () => {
  const router = useRouter();

  return (
    <PageSection width="md" layout="stack" align="center" className="gap-8 py-16">
      <Surface
        tone="base"
        elevation="floating"
        padding="lg"
        radius="xl"
        align="center"
        className="space-y-6 text-center"
      >
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-accent/15 text-accent">
          <Compass className="h-8 w-8" />
        </span>
        <Stack gap="sm" className="items-center text-center">
          <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">Página não encontrada</h1>
          <p className="max-w-md text-sm text-muted sm:text-base">
            O endereço que você tentou acessar não existe ou não está mais disponível. Volte para a área
            segura e continue a gestão da sua frota.
          </p>
        </Stack>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button type="button" onClick={() => router.push('/dashboard')} className="w-full sm:w-auto">
            Ir para o painel
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/')}
            icon={<HomeIcon className="h-4 w-4" />}
            className="w-full sm:w-auto"
          >
            Voltar ao início
          </Button>
        </div>
      </Surface>
    </PageSection>
  );
};
