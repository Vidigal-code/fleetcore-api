import type { Metadata } from 'next';

import { VehicleWorkbench } from '@/widgets/fleet/vehicle-workbench';
import { appConfig } from '@/shared/config/env';

export const metadata: Metadata = {
  title: `${appConfig.appName} · Veículos`,
};

export default function VehiclesPage() {
  return <VehicleWorkbench />;
}
