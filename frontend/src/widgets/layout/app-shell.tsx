'use client';

import type { ReactNode } from 'react';
import { startTransition, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { MainFooter } from '@/widgets/layout/main-footer';
import { MainHeader } from '@/widgets/layout/main-header';
import { MobileMenu } from '@/widgets/layout/mobile-menu';

interface AppShellProps {
  children: ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    startTransition(() => {
      setMobileMenuOpen(false);
    });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
      />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <main className="flex-1 bg-transparent pb-16 pt-10">
        <div className="container mx-auto flex flex-col items-center gap-10 px-4 sm:px-6 lg:gap-12 lg:px-8">
          {children}
        </div>
      </main>
      <MainFooter />
    </div>
  );
};
