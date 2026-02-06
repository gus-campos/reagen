'use client';

import React, { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { LoadingOverlay } from '@mantine/core';
import { ReagenShell } from '@/features/app-shell/app-shell.view';
import { useAppAuth } from '@/providers/auth.provider';
import { DataProvider } from '@/providers/data.provider';
import { DependencyInjectionProvider } from '@/providers/dependency-injection.provider';
import { NavigationDataProvider } from '@/providers/navigation-data.provider';

type RootLayoutProps = {
  children: ReactNode[];
};

export default function AuthenticatedLayout({ children }: RootLayoutProps) {
  const { user, loading } = useAppAuth();

  if (loading) return <LoadingOverlay visible />;

  if (!user) redirect('/autenticar');

  return (
    <DependencyInjectionProvider>
      <DataProvider>
        <NavigationDataProvider>
          <ReagenShell>{children}</ReagenShell>
        </NavigationDataProvider>
      </DataProvider>
    </DependencyInjectionProvider>
  );
}
