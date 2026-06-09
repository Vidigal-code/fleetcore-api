import type { Metadata } from 'next';
import { Manrope, Fira_Code } from 'next/font/google';

import { AppProviders } from '@/processes/app/providers/app-providers';
import { appConfig } from '@/shared/config/env';

import './globals.css';

const primaryFont = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const monoFont = Fira_Code({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${appConfig.appName} · Gestão de Frota`,
  description:
    'Painel completo para administração de veículos, modelos e marcas com cache inteligente e auditoria.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${primaryFont.variable} ${monoFont.variable}`}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
