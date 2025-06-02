'use client';

import { Box, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import SideDrawer from '../components/SideDrawer';
import TableView from '../view/TableView';

export default function Page() {
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);

  return (
    <>
      <SideDrawer drawerOpened={drawerOpened} closeDrawer={closeDrawer} />

      <Box
        style={{
          padding: '100px',
        }}
      >
        <TableView />
      </Box>

      <Button
        style={{ position: 'fixed', bottom: '20px', left: '20px' }}
        variant="default"
        onClick={openDrawer}
      >
        Opções
      </Button>
    </>
  );
}
