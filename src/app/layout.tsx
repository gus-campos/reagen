import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import React, { ReactNode } from 'react';
import { theme } from 'theme';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { DependencyInjectionProvider } from '@/providers/dependency-injection.provider';

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
          <DependencyInjectionProvider>{children}</DependencyInjectionProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
