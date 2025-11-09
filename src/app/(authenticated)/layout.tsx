import React, { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { ItemShell } from '../../features/app-shell/views/AppShell';
import { DataProvider } from '../../providers/DataProvider';

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
      <ItemShell>{children}</ItemShell>
    </DataProvider>
  );
}
