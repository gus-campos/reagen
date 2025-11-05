import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import React, { ReactNode } from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { theme } from '../../theme';
import { ItemShell } from '../features/app-shell/views/AppShell';
import { DataProvider } from '../providers/DataProvider';

export const metadata = {
  title: 'Controle de Reagentes',
  description: 'Controle fácil de reagentes químicos!',
};

type RootLayoutProps = {
  children: ReactNode[];
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <DataProvider>
            <ItemShell>{children}</ItemShell>
          </DataProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
