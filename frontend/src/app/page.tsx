import type { Metadata } from 'next';

import { HomeScreen } from '@/widgets/home/home-screen';
import { appConfig } from '@/shared/config/env';

export const metadata: Metadata = {
  title: `${appConfig.appName} · Plataforma de Gestão de Frota`,
};

export default function RootPage() {
  return <HomeScreen />;
}
