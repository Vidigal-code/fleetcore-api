'use client';

import { DashboardHero } from '@/widgets/dashboard/ui/dashboard-hero';
import { DashboardMetrics } from '@/widgets/dashboard/ui/dashboard-metrics';
import { DashboardQuickLinks } from '@/widgets/dashboard/ui/dashboard-quick-links';

export const DashboardScreen = () => (
  <>
    <DashboardHero />
    <DashboardMetrics />
    <DashboardQuickLinks />
  </>
);
