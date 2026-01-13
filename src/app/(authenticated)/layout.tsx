import React, { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { ReagenShell } from '@/features/app-shell/app-shell.view';
import { DataProvider } from '@/providers/data.provider';

type RootLayoutProps = {
  children: ReactNode[];
};

export default function AuthenticatedLayout({ children }: RootLayoutProps) {
  const authenticated = true;

  if (!authenticated) {
    redirect('/autenticar');
  }

  return (
    <DataProvider>
      <ReagenShell>{children}</ReagenShell>
    </DataProvider>
  );
}
