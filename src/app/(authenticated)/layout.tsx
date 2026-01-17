'use client';

import React, { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { LoadingOverlay } from '@mantine/core';
import { ReagenShell } from '@/features/app-shell/app-shell.view';
import { DataProvider } from '@/providers/data.provider';
import { useAuth } from '@/shared/hooks/useAuth';

type RootLayoutProps = {
  children: ReactNode[];
};

export default function AuthenticatedLayout({ children }: RootLayoutProps) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingOverlay visible />;

  console.log({ user });

  if (!user) {
    redirect('/autenticar');
  }

  return (
    <DataProvider>
      <ReagenShell>{children}</ReagenShell>
    </DataProvider>
  );
}
