import type { Metadata } from 'next';

import { HomeScreen } from '@/widgets/home/home-screen';
import { AppShell } from '@/widgets/layout/app-shell';
import { appConfig } from '@/shared/config/env';

export const metadata: Metadata = {
  title: `${appConfig.appName} · Plataforma de Gestão de Frota`,
};

export default function RootPage() {
  return (
    <AppShell>
      <HomeScreen />
    </AppShell>
  );
}
