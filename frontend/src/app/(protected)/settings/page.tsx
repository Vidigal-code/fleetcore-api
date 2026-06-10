import type { Metadata } from 'next';

import { SettingsScreen } from '@/widgets/settings/settings-screen';
import { appConfig } from '@/shared/config/env';

export const metadata: Metadata = {
  title: `${appConfig.appName} · Configurações`,
};

export default function SettingsPage() {
  return <SettingsScreen />;
}
