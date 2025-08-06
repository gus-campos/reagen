import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

//import './globals.css';

import React, { ReactNode } from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { theme } from '../../theme';
import { DataProvider } from '../providers/DataProvider';
import { ReagentShell } from '../view/ReagentsShell';

export const metadata = {
  title: 'Mantine Next.js template',
  description: 'I am using Mantine with Next.js!',
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
        <MantineProvider theme={theme}>
          <DataProvider>
            <ReagentShell>{children}</ReagentShell>
          </DataProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
