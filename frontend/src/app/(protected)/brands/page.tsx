import type { Metadata } from 'next';

import { BrandManagementBoard } from '@/widgets/fleet/reference-data-board';
import { appConfig } from '@/shared/config/env';

export const metadata: Metadata = {
  title: `${appConfig.appName} · Marcas`,
};

export default function BrandsPage() {
  return <BrandManagementBoard />;
}
