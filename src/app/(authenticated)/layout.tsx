import React, { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { ReagenShell } from '../../features/app-shell/views/ReagenShell';
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
      <ReagenShell>{children}</ReagenShell>
    </DataProvider>
  );
}
