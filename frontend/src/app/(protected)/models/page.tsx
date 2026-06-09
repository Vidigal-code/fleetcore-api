import type { Metadata } from 'next';

import { ModelManagementBoard } from '@/widgets/fleet/reference-data-board';
import { appConfig } from '@/shared/config/env';

export const metadata: Metadata = {
  title: `${appConfig.appName} · Modelos`,
};

export default function ModelsPage() {
  return <ModelManagementBoard />;
}
