'use client';

import { Box } from '@mantine/core';
import TableView from '../view/TableView';

export default function Page() {
  return (
    <Box
      style={{
        padding: '100px',
      }}
    >
      <TableView />
    </Box>
  );
}
