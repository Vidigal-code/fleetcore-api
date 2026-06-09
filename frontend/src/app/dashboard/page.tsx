'use client';

import { RequireAuth } from '@/processes/auth/ui/require-auth';
import { DashboardScreen } from '@/widgets/dashboard/dashboard-screen';

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardScreen />
    </RequireAuth>
  );
}
