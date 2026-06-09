import type { Metadata } from 'next';

import { DashboardScreen } from '@/widgets/dashboard/dashboard-screen';
import { appConfig } from '@/shared/config/env';

export const metadata: Metadata = {
  title: `${appConfig.appName} · Painel`,
};

export default function DashboardPage() {
  return <DashboardScreen />;
}
