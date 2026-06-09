import type { ReactNode } from 'react';

import { RequireAuth } from '@/processes/auth/ui/require-auth';
import { AppShell } from '@/widgets/layout/app-shell';

export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RequireAuth>
      <AppShell>{children}</AppShell>
    </RequireAuth>
  );
}
